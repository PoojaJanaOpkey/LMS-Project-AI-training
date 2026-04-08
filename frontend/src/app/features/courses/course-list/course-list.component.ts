import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = true;
  
  searchQuery = '';
  selectedCategory = '';
  selectedLevel = '';
  sortBy = 'popular';
  
  categories = ['programming', 'design', 'business', 'marketing'];
  levels = ['beginner', 'intermediate', 'advanced'];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.loadCourses();
    });
  }

  loadCourses(): void {
    this.loading = true;
    
    // Mock data - replace with actual API call
    // this.courseService.getAllCourses().subscribe(...);
    
    setTimeout(() => {
      this.courses = this.getMockCourses();
      this.applyFilters();
      this.loading = false;
    }, 500);
  }

  applyFilters(): void {
    let result = [...this.courses];
    
    // Search filter
    if (this.searchQuery) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    // Category filter
    if (this.selectedCategory) {
      result = result.filter(course => course.category === this.selectedCategory);
    }
    
    // Level filter
    if (this.selectedLevel) {
      result = result.filter(course => course.level === this.selectedLevel);
    }
    
    // Sort
    switch(this.sortBy) {
      case 'popular':
        result.sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
    }
    
    this.filteredCourses = result;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedLevel = '';
    this.sortBy = 'popular';
    this.applyFilters();
  }

  private getMockCourses(): Course[] {
    return [
      {
        id: 1,
        title: 'Full Stack Web Development',
        description: 'Master modern web development with React, Node.js, and MongoDB',
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
        description: 'Create stunning user interfaces and experiences',
        category: 'design',
        level: 'beginner',
        price: 79.99,
        duration: 25,
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        instructorName: 'Jane Smith',
        rating: 4.9,
        totalRatings: 189,
        totalEnrollments: 890
      },
      {
        id: 3,
        title: 'Digital Marketing Strategies',
        description: 'Learn modern digital marketing techniques',
        category: 'marketing',
        level: 'intermediate',
        price: 89.99,
        duration: 30,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        instructorName: 'Mike Johnson',
        rating: 4.7,
        totalRatings: 156,
        totalEnrollments: 675
      },
      {
        id: 4,
        title: 'Data Science with Python',
        description: 'Analyze data and build machine learning models',
        category: 'programming',
        level: 'advanced',
        price: 119.99,
        duration: 50,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        instructorName: 'Sarah Williams',
        rating: 4.9,
        totalRatings: 312,
        totalEnrollments: 1450
      },
      {
        id: 5,
        title: 'Business Strategy Fundamentals',
        description: 'Develop effective business strategies',
        category: 'business',
        level: 'beginner',
        price: 69.99,
        duration: 20,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
        instructorName: 'David Brown',
        rating: 4.6,
        totalRatings: 98,
        totalEnrollments: 432
      },
      {
        id: 6,
        title: 'Mobile App Development',
        description: 'Build iOS and Android apps with React Native',
        category: 'programming',
        level: 'intermediate',
        price: 94.99,
        duration: 35,
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
        instructorName: 'Emily Davis',
        rating: 4.8,
        totalRatings: 223,
        totalEnrollments: 987
      },
      {
        id: 7,
        title: 'Graphic Design Essentials',
        description: 'Master Adobe Creative Suite and design principles',
        category: 'design',
        level: 'beginner',
        price: 74.99,
        duration: 28,
        imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400',
        instructorName: 'Alex Turner',
        rating: 4.7,
        totalRatings: 167,
        totalEnrollments: 745
      },
      {
        id: 8,
        title: 'Project Management Professional',
        description: 'Learn PMP methodologies and best practices',
        category: 'business',
        level: 'advanced',
        price: 109.99,
        duration: 45,
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
        instructorName: 'Robert Lee',
        rating: 4.8,
        totalRatings: 203,
        totalEnrollments: 823
      }
    ];
  }
}
