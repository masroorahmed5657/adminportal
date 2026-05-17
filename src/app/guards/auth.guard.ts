import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Pehle localStorage check karo (remember me ke liye)
    const localUser = localStorage.getItem('currentUser');
    const localToken = localStorage.getItem('Token');

    // Agar localStorage me login mila → allow karo
    if (localUser && localToken) {
      return true;
    }

    // Agar sessionStorage me login mila → allow karo
    const sessionUser = sessionStorage.getItem('currentUser');
    const sessionToken = sessionStorage.getItem('Token');

    if (sessionUser && sessionToken) {
      return true;
    }

    // Agar kuch bhi nahi mila → redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
