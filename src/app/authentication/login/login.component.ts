import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router){

  }

  login(): void{
    this.authService.login(this.email, this.password).subscribe({
      next: ()=> this.router.navigate(['/home']),
      error: (erro) => console.error('Login failed', erro)
    })
  }
  
}
