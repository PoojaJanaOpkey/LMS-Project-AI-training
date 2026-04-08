export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  duration: number; // in hours
  imageUrl?: string;
  instructorName: string;
  rating?: number;
  totalRatings?: number;
  totalEnrollments?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number; // percentage
  enrolledAt: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
}

export interface CourseProgress {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}
