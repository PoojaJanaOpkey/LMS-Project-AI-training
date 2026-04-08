export interface Rating {
  id: number;
  userId: number;
  courseId: number;
  rating: number; // 1-5
  review: string;
  createdAt: Date;
  userName?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface Payment {
  id: number;
  userId: number;
  courseId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
