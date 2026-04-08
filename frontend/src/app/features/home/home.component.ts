import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private courseService = inject(CourseService);
  private seoService = inject(SeoService);
  
  popularCourses: Course[] = [];
  loading = true;
  
  stats = [
    { icon: 'bi-book', value: '1000+', label: 'Courses Available', color: 'primary' },
    { icon: 'bi-people', value: '50,000+', label: 'Active Students', color: 'success' },
    { icon: 'bi-person-workspace', value: '500+', label: 'Expert Instructors', color: 'warning' },
    { icon: 'bi-trophy', value: '95%', label: 'Success Rate', color: 'danger' }
  ];
  
  features = [
    {
      icon: 'bi-laptop',
      title: 'Online Learning',
      description: 'Access courses anytime, anywhere with our flexible online platform'
    },
    {
      icon: 'bi-award',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: 'bi-certificate',
      title: 'Certification',
      description: 'Earn recognized certificates upon successful course completion'
    },
    {
      icon: 'bi-chat-dots',
      title: 'Interactive Learning',
      description: 'Engage with instructors and peers through our interactive platform'
    },
    {
      icon: 'bi-graph-up',
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress analytics'
    },
    {
      icon: 'bi-clock-history',
      title: 'Lifetime Access',
      description: 'Get unlimited access to course materials even after completion'
    }
  ];
  
  carouselSlides = [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
      title: 'Transform Your Career with Online Learning',
      description: 'Access world-class courses from anywhere'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
      title: 'Learn from Industry Experts',
      description: 'Get mentored by professionals with years of experience'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
      title: 'Achieve Your Goals',
      description: 'Join thousands of successful students worldwide'
    }
  ];

  ngOnInit(): void {
    // Initialize SEO
    this.seoService.updateMetaTags({
      title: 'Home',
      description: 'Learn from the best courses online. Access thousands of courses in programming, design, business, and more. Transform your career with our expert-led online learning platform.',
      keywords: 'online courses, e-learning, programming courses, design courses, business courses, certification, LMS'
    });
    this.seoService.generateOrganizationSchema();
    
    this.loadPopularCourses();
  }

  loadPopularCourses(): void {
    // For now, creating mock data since backend is not implemented yet
    // this.courseService.getAllCourses({ limit: 6 }).subscribe(...);
    
    this.popularCourses = [
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
      }
    ];
    
    this.loading = false;
  }
}
