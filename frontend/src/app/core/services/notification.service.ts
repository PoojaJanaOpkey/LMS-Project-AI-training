import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;
  
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    // Load from localStorage for demo
    const stored = localStorage.getItem('notifications');
    if (stored) {
      const notifications = JSON.parse(stored);
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount(notifications);
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'userId'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      userId: 0, // System notification
      read: false,
      createdAt: new Date()
    };
    
    const current = this.notificationsSubject.value;
    const updated = [newNotification, ...current];
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
    this.saveToLocalStorage(updated);
  }

  markAsRead(id: number): void {
    const current = this.notificationsSubject.value;
    const updated = current.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
    this.saveToLocalStorage(updated);
  }

  markAllAsRead(): void {
    const current = this.notificationsSubject.value;
    const updated = current.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
    this.saveToLocalStorage(updated);
  }

  deleteNotification(id: number): void {
    const current = this.notificationsSubject.value;
    const updated = current.filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
    this.saveToLocalStorage(updated);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    localStorage.removeItem('notifications');
  }

  showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    this.addNotification({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      type
    });
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const count = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(count);
  }

  private saveToLocalStorage(notifications: Notification[]): void {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  // Simulate real-time notifications
  simulateNotification(type: 'enrollment' | 'course_update' | 'deadline' | 'announcement'): void {
    const notifications = {
      enrollment: {
        title: 'Enrollment Successful!',
        message: 'You have successfully enrolled in a new course.',
        type: 'success' as const
      },
      course_update: {
        title: 'Course Updated',
        message: 'New content has been added to your enrolled course.',
        type: 'info' as const
      },
      deadline: {
        title: 'Upcoming Deadline',
        message: 'You have an assignment due in 2 days.',
        type: 'warning' as const
      },
      announcement: {
        title: 'New Announcement',
        message: 'Important announcement from your instructor.',
        type: 'info' as const
      }
    };

    this.addNotification(notifications[type]);
  }
}
