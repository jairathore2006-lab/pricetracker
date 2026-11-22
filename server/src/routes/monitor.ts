import { Router, Request, Response } from 'express';
import { priceMonitor } from '../engine/priceMonitor.js';

const router = Router();

// GET /api/monitor/status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: priceMonitor.getStatus(),
  });
});

// POST /api/monitor/trigger - Manual instant price verification
router.post('/trigger', async (req: Request, res: Response) => {
  try {
    const result = await priceMonitor.runPriceCheck('manual');
    res.json({
      success: true,
      message: `Price check completed for ${result.checkedCount} products.`,
      result,
      status: priceMonitor.getStatus(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/monitor/interval - Configure check interval
router.post('/interval', (req: Request, res: Response) => {
  const { intervalMinutes } = req.body;
  if (typeof intervalMinutes === 'number' && intervalMinutes >= 1) {
    priceMonitor.setCheckInterval(intervalMinutes);
    return res.json({
      success: true,
      message: `Monitoring interval updated to every ${intervalMinutes} minutes.`,
      status: priceMonitor.getStatus(),
    });
  }
  res.status(400).json({ success: false, error: 'Valid positive integer interval in minutes required.' });
});

export default router;
