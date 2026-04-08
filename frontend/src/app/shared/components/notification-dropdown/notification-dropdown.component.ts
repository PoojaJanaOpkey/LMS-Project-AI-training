import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/common.model';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dropdown">
      <button 
        class="btn btn-link nav-link position-relative" 
        type="button" 
        id="notificationDropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false">
        <i class="bi bi-bell fs-5"></i>
        @if (unreadCount > 0) {
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        }
      </button>
      
      <div class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="notificationDropdown">
        <div class="notification-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 class="mb-0">Notifications</h6>
          @if (unreadCount > 0) {
            <button class="btn btn-link btn-sm text-primary p-0" (click)="markAllRead()">
              Mark all read
            </button>
          }
        </div>
        
        <div class="notification-body" style="max-height: 400px; overflow-y: auto;">
          @if (notifications.length === 0) {
            <div class="text-center py-4 text-muted">
              <i class="bi bi-bell-slash fs-1"></i>
              <p class="mb-0 mt-2">No notifications</p>
            </div>
          } @else {
            @for (notification of notifications; track notification.id) {
              <div 
                class="notification-item p-3 border-bottom"
                [class.unread]="!notification.read"
                (click)="markAsRead(notification.id)">
                <div class="d-flex align-items-start">
                  <div class="flex-shrink-0 me-2">
                    <i class="bi fs-4" 
                       [ngClass]="{
                         'bi-info-circle text-info': notification.type === 'info',
                         'bi-check-circle text-success': notification.type === 'success',
                         'bi-exclamation-triangle text-warning': notification.type === 'warning',
                         'bi-x-circle text-danger': notification.type === 'error'
                       }"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ notification.title }}</h6>
                    <p class="mb-1 small text-muted">{{ notification.message }}</p>
                    <small class="text-muted">{{ getTimeAgo(notification.createdAt) }}</small>
                  </div>
                  <button 
                    class="btn btn-link btn-sm text-muted p-0 ms-2"
                    (click)="deleteNotification(notification.id); $event.stopPropagation()">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            }
          }
        </div>
        
        @if (notifications.length > 0) {
          <div class="notification-footer p-2 border-top text-center">
            <button class="btn btn-link btn-sm text-danger" (click)="clearAll()">
              Clear all notifications
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .notification-dropdown {
      width: 360px;
      max-width: 90vw;
    }
    
    .notification-item {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .notification-item:hover {
      background-color: #f8f9fa;
    }
    
    .notification-item.unread {
      background-color: #e7f3ff;
    }
    
    .notification-header h6 {
      font-weight: 600;
    }
  `]
})
export class NotificationDropdownComponent implements OnInit {
  private notificationService = inject(NotificationService);
  
  notifications: Notification[] = [];
  unreadCount = 0;

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
    
    this.notificationService.unreadCount$.subscribe((count: number) => {
      this.unreadCount = count;
    });
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id);
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id);
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear all notifications?')) {
      this.notificationService.clearAll();
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  }
}
