import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>;
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const userRole = authService.getUserRole();
  
  if (requiredRoles && requiredRoles.includes(userRole)) {
    return true;
  }

  // User doesn't have permission
  router.navigate(['/']);
  return false;
};
