import { Router, Request, Response } from 'express';
import { dataStore } from '../db/storage.js';
import { retailerRegistry } from '../adapters/index.js';

const router = Router();

// GET /api/products - Search & filter
router.get('/', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const category = (req.query.category as string) || 'all';
    const brand = (req.query.brand as string) || 'all';

    const results = dataStore.searchProducts(q, category, brand);
    res.json({
      success: true,
      count: results.length,
      query: q,
      category,
      brand,
      products: results,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/suggestions - Autocomplete suggestions
router.get('/suggestions', (req: Request, res: Response) => {
  try {
    const q = ((req.query.q as string) || '').toLowerCase().trim();
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const all = dataStore.getAllProducts();
    const suggestionsSet = new Set<string>();

    for (const p of all) {
      if (p.title.toLowerCase().includes(q)) suggestionsSet.add(p.title);
      if (p.model.toLowerCase().includes(q)) suggestionsSet.add(`${p.brand} ${p.model}`);
      if (p.brand.toLowerCase().startsWith(q)) suggestionsSet.add(p.brand);
    }

    res.json({ suggestions: Array.from(suggestionsSet).slice(0, 6) });
  } catch (err: any) {
    res.status(500).json({ suggestions: [] });
  }
});

// GET /api/products/recent-searches
router.get('/recent-searches', (req: Request, res: Response) => {
  res.json({ recentSearches: dataStore.getRecentSearches() });
});

// POST /api/products/recent-searches
router.post('/recent-searches', (req: Request, res: Response) => {
  const { query } = req.body;
  if (query) {
    dataStore.addRecentSearch(query);
  }
  res.json({ success: true, recentSearches: dataStore.getRecentSearches() });
});

// DELETE /api/products/recent-searches
router.delete('/recent-searches', (req: Request, res: Response) => {
  dataStore.clearRecentSearches();
  res.json({ success: true });
});

// POST /api/products/extract-url - Extract from retailer URL
router.post('/extract-url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid product URL.',
      });
    }

    // Friendly delay simulation for realistic parsing if needed
    const result = await retailerRegistry.extractFromUrl(url.trim());

    if (result.product) {
      return res.json({
        success: true,
        matchedExisting: true,
        retailer: result.retailer,
        product: result.product,
      });
    }

    // Return extracted info
    res.json({
      success: true,
      matchedExisting: false,
      retailer: result.retailer,
      extracted: result.rawExtracted,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Unable to parse product information from the provided URL.',
    });
  }
});

// GET /api/products/:id - Single product details
router.get('/:id', (req: Request, res: Response) => {
  const product = dataStore.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }
  res.json({ success: true, product });
});

export default router;
