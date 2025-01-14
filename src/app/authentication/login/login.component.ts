import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = error; // Mostrar el mensaje de error
      }
    });
  }
}
