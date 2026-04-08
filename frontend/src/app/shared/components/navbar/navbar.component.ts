import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificationDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser: User | null = null;
  isMenuCollapsed = true;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isStudent(): boolean {
    return this.authService.isStudent();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
