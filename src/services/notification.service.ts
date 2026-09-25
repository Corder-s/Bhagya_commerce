/**
 * Bhagya Commerce — Notification Service
 *
 * Frontend service abstraction prepared for future Spring Boot notification endpoints:
 *  - GET   /api/v1/notifications
 *  - GET   /api/v1/notifications/unread-count
 *  - PATCH /api/v1/notifications/{id}/read
 *  - POST  /api/v1/notifications/read-all
 *  - DELETE /api/v1/notifications/{id}
 */

import type { Notification, NotificationPreferences, NotificationType } from "@/features/notifications/notification-types";
import { notificationStorage } from "@/lib/storage/notification-storage";

class NotificationService {
  /**
   * Fetch all notifications with optional type filtering
   */
  async getNotifications(filter?: NotificationType | "all"): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = notificationStorage.getNotifications();
    if (!filter || filter === "all") return all;
    return all.filter((n) => n.type === filter);
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const all = notificationStorage.getNotifications();
    return all.filter((n) => !n.read).length;
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string): Promise<boolean> {
    const all = notificationStorage.getNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    notificationStorage.saveNotifications(updated);
    return true;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<boolean> {
    const all = notificationStorage.getNotifications();
    const updated = all.map((n) => ({ ...n, read: true }));
    notificationStorage.saveNotifications(updated);
    return true;
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<boolean> {
    const all = notificationStorage.getNotifications();
    const updated = all.filter((n) => n.id !== id);
    notificationStorage.saveNotifications(updated);
    return true;
  }

  /**
   * Post a new notification
   */
  async pushNotification(notification: Omit<Notification, "id" | "createdAt" | "read">): Promise<Notification> {
    const all = notificationStorage.getNotifications();
    const newNotif: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    all.unshift(newNotif);
    notificationStorage.saveNotifications(all);
    return newNotif;
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    return notificationStorage.getPreferences();
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(prefs: NotificationPreferences): Promise<NotificationPreferences> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    notificationStorage.savePreferences(prefs);
    return prefs;
  }
}

export const notificationService = new NotificationService();
