import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {
  private courseService = inject(CourseService);
  private notificationService = inject(NotificationService);

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchQuery = '';
  loading = true;
  showModal = false;
  editingCourse: Partial<Course> = {};
  isEditing = false;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    
    // Mock data
    setTimeout(() => {
      this.courses = [
        {
          id: 1,
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
        },
        {
          id: 2,
          title: 'UI/UX Design Mastery',
          description: 'Create stunning interfaces',
          category: 'design',
          level: 'beginner',
          price: 79.99,
          duration: 25,
          imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
          instructorName: 'Jane Smith',
          rating: 4.9,
          totalRatings: 189,
          totalEnrollments: 890
        }
      ];
      this.filteredCourses = this.courses;
      this.loading = false;
    }, 500);
  }

  searchCourses(): void {
    if (!this.searchQuery) {
      this.filteredCourses = this.courses;
      return;
    }
    this.filteredCourses = this.courses.filter(c =>
      c.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingCourse = {
      title: '',
      description: '',
      category: 'programming',
      level: 'beginner',
      price: 0,
      duration: 0,
      instructorName: ''
    };
    this.showModal = true;
  }

  openEditModal(course: Course): void {
    this.isEditing = true;
    this.editingCourse = { ...course };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCourse = {};
  }

  saveCourse(): void {
    if (this.isEditing) {
      this.notificationService.showToast('Course updated successfully', 'success');
    } else {
      this.notificationService.showToast('Course created successfully', 'success');
    }
    this.closeModal();
    this.loadCourses();
  }

  deleteCourse(course: Course): void {
    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      this.notificationService.showToast('Course deleted successfully', 'success');
      this.loadCourses();
    }
  }
}
