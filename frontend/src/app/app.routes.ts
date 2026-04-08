import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail.component';
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { CourseManagementComponent } from './features/admin/course-management/course-management.component';
import { StudentManagementComponent } from './features/admin/student-management/student-management.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { ContactComponent } from './features/contact/contact.component';
import { PaymentComponent } from './features/payment/payment.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home - LMS'
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Login - LMS'
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    title: 'Register - LMS'
  },
  {
    path: 'courses',
    component: CourseListComponent,
    title: 'Courses - LMS'
  },
  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    title: 'Course Details - LMS'
  },
  {
    path: 'student/dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student'] },
    title: 'Student Dashboard - LMS'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    title: 'Admin Dashboard - LMS'
  },
  {
    path: 'admin/courses',
    component: CourseManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    title: 'Course Management - LMS'
  },
  {
    path: 'admin/students',
    component: StudentManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    title: 'Student Management - LMS'
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    title: 'Gallery - LMS'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact Us - LMS'
  },
  {
    path: 'payment/:courseId',
    component: PaymentComponent,
    canActivate: [authGuard],
    title: 'Payment - LMS'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
