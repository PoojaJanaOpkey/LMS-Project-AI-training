import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/common.model';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  private notificationService = inject(NotificationService);
  notifications: Notification[] = [];

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  removeNotification(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  getToastClass(type: string): string {
    const classes: any = {
      'success': 'bg-success',
      'error': 'bg-danger',
      'warning': 'bg-warning',
      'info': 'bg-info'
    };
    return classes[type] || 'bg-info';
  }
}
