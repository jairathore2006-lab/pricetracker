import { Router, Request, Response } from 'express';
import { dataStore } from '../db/storage.js';

const router = Router();

// GET /api/notifications
router.get('/', (req: Request, res: Response) => {
  const notifications = dataStore.getAllNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  res.json({
    success: true,
    notifications,
    unreadCount,
  });
});

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', (req: Request, res: Response) => {
  const success = dataStore.markNotificationAsRead(req.params.id);
  res.json({ success });
});

// PUT /api/notifications/read-all - Mark all read
router.put('/read-all', (req: Request, res: Response) => {
  dataStore.markAllNotificationsAsRead();
  res.json({ success: true });
});

// DELETE /api/notifications - Clear all
router.delete('/', (req: Request, res: Response) => {
  dataStore.clearNotifications();
  res.json({ success: true });
});

export default router;
