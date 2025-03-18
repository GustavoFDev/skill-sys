import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export default class ResetPasswordComponent implements OnInit {

  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  token: string = ''; 
  errorMessage: string = '';
  isLoading: boolean = false; 
  
  isSuccess: boolean = false; // Nuevo estado para el icono de éxito

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
  }

  reset(): void {
    
    this.errorMessage = '';

    if (this.password !== this.passwordConfirmation) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.authService.resetPassword(this.token, this.password, this.passwordConfirmation).subscribe({
        next: () => {
          this.isLoading = false;
          this.isSuccess = true; // Mostrar palomita de confirmación

          // Redirigir al usuario después de 2 segundos
          setTimeout(() => {
            //this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error resetting password:', error);

          if (error.status === 400 && error.error.message === 'Invalid or expired token.') {
            this.errorMessage = 'El token ya fue usado o ha caducado. Solicita un nuevo restablecimiento de contraseña.';
          } else {
            this.errorMessage = 'Hubo un error al restablecer la contraseña. Intenta nuevamente.';
          }

          this.isLoading = false;
        }
      });
    }, 1000); // Delay para mostrar spinner
  }
  

}

