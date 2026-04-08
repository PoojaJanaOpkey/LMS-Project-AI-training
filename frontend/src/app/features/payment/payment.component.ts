import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { NotificationService } from '../../core/services/notification.service';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private notificationService = inject(NotificationService);

  course: Course | null = null;
  loading = true;
  processing= false;
  paymentMethod = 'card';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = +params['courseId'];
      this.loadCourse(courseId);
    });
  }

  loadCourse(courseId: number): void {
    this.loading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.course = {
        id: courseId,
        title: 'Full Stack Web Development',
        description: 'Master modern web development',
        category: 'programming',
        level: 'intermediate',
        price: 99.99,
        duration: 40,
        imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400',
        instructorName: 'John Doe',
        rating: 4.8,
        totalRatings: 245,
        totalEnrollments: 1200
      };
      this.loading = false;
    }, 500);
  }

  processPayment(): void {
    if (!this.course) return;

    this.processing = true;

    // Simulate payment processing
    setTimeout(() => {
      // Create payment record
      this.paymentService.createPayment(this.course!.id, this.course!.price).subscribe({
        next: (payment) => {
          // Enroll student after successful payment
          this.enrollmentService.enrollInCourse(this.course!.id).subscribe({
            next: () => {
              this.processing = false;
              this.notificationService.showToast('Payment successful! You are now enrolled.', 'success');
              this.router.navigate(['/student/dashboard']);
            },
            error: () => {
              this.processing = false;
              this.notificationService.showToast('Payment successful but enrollment failed. Please contact support.', 'warning');
            }
          });
        },
        error: () => {
          this.processing = false;
          this.notificationService.showToast('Payment failed. Please try again.', 'error');
        }
      });
    }, 2000);
  }

  cancel(): void {
    this.router.navigate(['/courses', this.course?.id]);
  }
}
