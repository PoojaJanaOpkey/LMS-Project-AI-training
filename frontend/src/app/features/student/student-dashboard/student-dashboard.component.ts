import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, Enrollment, CourseProgress } from '../../../core/models/course.model';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(AuthService);

  enrolledCourses: any[] = [];
  stats = {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursLearned: 0
  };
  loading = true;
  currentUser = this.authService.getCurrentUser();

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Mock data - replace with actual API calls
    setTimeout(() => {
      this.enrolledCourses = this.getMockEnrolledCourses();
      this.calculateStats();
      this.loading = false;
    }, 500);
  }

  calculateStats(): void {
    this.stats.totalCourses = this.enrolledCourses.length;
    this.stats.completedCourses = this.enrolledCourses.filter(c => c.progress === 100).length;
    this.stats.inProgressCourses = this.enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length;
    this.stats.totalHoursLearned = this.enrolledCourses.reduce((sum, c) => sum + (c.duration * c.progress / 100), 0);
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'info';
    if (progress >= 25) return 'warning';
    return 'danger';
  }

  private getMockEnrolledCourses(): any[] {
    return [
      {
        id: 1,
        title: 'Full Stack Web Development',
        category: 'programming',
        imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400',
        progress: 65,
        duration: 40,
        instructor: 'John Doe',
        enrolledAt: new Date('2024-01-15'),
        lastAccessedAt: new Date('2024-03-20')
      },
      {
        id: 2,
        title: 'UI/UX Design Mastery',
        category: 'design',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        progress: 100,
        duration: 25,
        instructor: 'Jane Smith',
        enrolledAt: new Date('2024-02-01'),
        lastAccessedAt: new Date('2024-03-15')
      },
      {
        id: 3,
        title: 'Digital Marketing Strategies',
        category: 'marketing',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        progress: 30,
        duration: 30,
        instructor: 'Mike Johnson',
        enrolledAt: new Date('2024-03-01'),
        lastAccessedAt: new Date('2024-03-18')
      },
      {
        id: 4,
        title: 'Data Science with Python',
        category: 'programming',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        progress: 45,
        duration: 50,
        instructor: 'Sarah Williams',
        enrolledAt: new Date('2024-01-20'),
        lastAccessedAt: new Date('2024-03-22')
      }
    ];
  }
}
