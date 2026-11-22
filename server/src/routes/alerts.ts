import { Router, Request, Response } from 'express';
import { dataStore } from '../db/storage.js';
import { PriceAlert } from '../types/index.js';

const router = Router();

// GET /api/alerts
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    alerts: dataStore.getAllAlerts(),
  });
});

// POST /api/alerts - Create alert
router.post('/', (req: Request, res: Response) => {
  try {
    const { productId, targetPrice, userEmail } = req.body;

    if (!productId || typeof targetPrice !== 'number' || targetPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid alert details. Product ID and positive target price are required.',
      });
    }

    const product = dataStore.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const currentBest = Math.min(...product.listings.map((l) => l.finalPrice));

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      productTitle: product.title,
      productImageUrl: product.imageUrl,
      brand: product.brand,
      targetPrice,
      currentPrice: currentBest,
      initialPrice: currentBest,
      userEmail: userEmail || undefined,
      active: true,
      createdAt: new Date().toISOString(),
      triggerCount: 0,
    };

    dataStore.saveAlert(newAlert);

    res.status(201).json({
      success: true,
      message: `Price drop alert activated for ${product.title} at ₹${targetPrice.toLocaleString('en-IN')}.`,
      alert: newAlert,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/alerts/:id - Edit target price or toggle active
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetPrice, active } = req.body;

    const updates: Partial<PriceAlert> = {};
    if (typeof targetPrice === 'number' && targetPrice > 0) updates.targetPrice = targetPrice;
    if (typeof active === 'boolean') updates.active = active;

    const updated = dataStore.updateAlert(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Alert not found.' });
    }

    res.json({ success: true, alert: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/alerts/:id - Delete alert
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = dataStore.deleteAlert(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Alert not found.' });
  }
  res.json({ success: true, message: 'Price alert successfully removed.' });
});

export default router;
