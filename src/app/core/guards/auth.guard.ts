import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return true;
  }

  return inject(Router).createUrlTree(['/dashboard']);
};