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
  showLoginForm: boolean = true; // Controla qué formulario se muestra.

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = error;
      }
    });
  }

  recoverPassword(): void {
    if (!this.email) {
      this.errorMessage = 'Por favor ingresa un correo válido.';
      return;
    }
  
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('Recovery email sent:', response);
        alert('Se ha enviado un correo para la recuperación de tu contraseña.');
        this.toggleForgotPassword(); // Regresa al formulario de login
      },
      error: (error) => {
        console.error('Error sending recovery email:', error);
        this.errorMessage = 'Hubo un error al enviar el correo de recuperación.';
      }
    });
  }
  
  toggleForgotPassword(): void {
    this.showLoginForm = !this.showLoginForm;
  }
}
