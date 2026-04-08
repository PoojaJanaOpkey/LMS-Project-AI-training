import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { RatingService } from '../../../core/services/rating.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Course, Module } from '../../../core/models/course.model';
import { Rating } from '../../../core/models/common.model';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private ratingService = inject(RatingService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  course: Course | null = null;
  modules: Module[] = [];
  ratings: Rating[] = [];
  loading = true;
  enrolling = false;
  isEnrolled = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = +params['id'];
      this.loadCourseDetails(courseId);
    });
  }

  loadCourseDetails(courseId: number): void {
    this.loading = true;
    
    // Mock data - replace with actual API calls
    setTimeout(() => {
      this.course = this.getMockCourse(courseId);
      this.modules = this.getMockModules(courseId);
      this.ratings = this.getMockRatings(courseId);
      this.loading = false;
    }, 500);
  }

  enrollInCourse(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showToast('Please login to enroll', 'warning');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.course) return;

    this.enrolling = true;
    
    // Check if course is free or needs payment
    if (this.course.price === 0) {
      this.processEnrollment();
    } else {
      this.router.navigate(['/payment', this.course.id]);
    }
  }

  private processEnrollment(): void {
    if (!this.course) return;
    
    this.enrollmentService.enrollInCourse(this.course.id).subscribe({
      next: () => {
        this.enrolling = false;
        this.isEnrolled = true;
        this.notificationService.showToast('Successfully enrolled in course!', 'success');
        this.router.navigate(['/student/dashboard']);
      },
      error: (error) => {
        this.enrolling = false;
        this.notificationService.showToast('Enrollment failed. Please try again.', 'error');
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  private getMockCourse(id: number): Course {
    return {
      id: 1,
      title: 'Full Stack Web Development',
      description: 'Master modern web development with React, Node.js, and MongoDB. This comprehensive course covers everything from frontend to backend development, including database management and deployment.',
      category: 'programming',
      level: 'intermediate' as const,
      price: 99.99,
      duration: 40,
      imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800',
      instructorName: 'John Doe',
      rating: 4.8,
      totalRatings: 245,
      totalEnrollments: 1200
    };
  }

  private getMockModules(courseId: number): Module[] {
    return [
      {
        id: 1,
        courseId: courseId,
        title: 'Introduction to Web Development',
        description: 'Get started with web development fundamentals',
        order: 1,
        lessons: [
          { id: 1, moduleId: 1, title: 'What is Web Development?', content: '', duration: 15, order: 1 },
          { id: 2, moduleId: 1, title: 'Setting up Development Environment', content: '', duration: 20, order: 2 },
          { id: 3, moduleId: 1, title: 'HTML Basics', content: '', duration: 30, order: 3 }
        ]
      },
      {
        id: 2,
        courseId: courseId,
        title: 'Advanced Frontend with React',
        description: 'Build modern user interfaces with React',
        order: 2,
        lessons: [
          { id: 4, moduleId: 2, title: 'Introduction to React', content: '', duration: 25, order: 1 },
          { id: 5, moduleId: 2, title: 'Components and Props', content: '', duration: 30, order: 2 },
          { id: 6, moduleId: 2, title: 'State Management', content: '', duration: 35, order: 3 }
        ]
      },
      {
        id: 3,
        courseId: courseId,
        title: 'Backend Development with Node.js',
        description: 'Create powerful backend APIs',
        order: 3,
        lessons: [
          { id: 7, moduleId: 3, title: 'Node.js Fundamentals', content: '', duration: 30, order: 1 },
          { id: 8, moduleId: 3, title: 'Express.js Framework', content: '', duration: 35, order: 2 },
          { id: 9, moduleId: 3, title: 'RESTful APIs', content: '', duration: 40, order: 3 }
        ]
      }
    ];
  }

  private getMockRatings(courseId: number): Rating[] {
    return [
      {
        id: 1,
        userId: 1,
        courseId: courseId,
        rating: 5,
        review: 'Excellent course! Very comprehensive and well-structured.',
        createdAt: new Date('2024-01-15'),
        userName: 'Alice Johnson'
      },
      {
        id: 2,
        userId: 2,
        courseId: courseId,
        rating: 4,
        review: 'Great content, but could use more practical examples.',
        createdAt: new Date('2024-01-20'),
        userName: 'Bob Smith'
      },
      {
        id: 3,
        userId: 3,
        courseId: courseId,
        rating: 5,
        review: 'Best web development course I have taken. Highly recommended!',
        createdAt: new Date('2024-01-25'),
        userName: 'Carol White'
      }
    ];
  }
}
