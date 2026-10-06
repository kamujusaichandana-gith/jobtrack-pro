import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private router = inject(Router);
  email = '';
  password = '';
  submitted = false;

  login(): void {
    this.submitted = true;
    if (!this.email.trim() || !this.password.trim()) {
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/dashboard']);
  }
}
