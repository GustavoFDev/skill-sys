import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://127.0.0.1:8000/api/login';
  private LOGOUT_URL = 'http://127.0.0.1:8000/api/logout';
  private REGISTER_URL = 'http://127.0.0.1:8000/api/register';
  private CONSULT_USERS = 'http://127.0.0.1:8000/api/users-index';
  private forgotPss = 'http://127.0.0.1:8000/api/forgot-password';
  private resetPass = 'http://127.0.0.1:8000/api/reset-password';

  private tokenKey = 'authToken';
  private usernameKey = 'username';

  constructor(private httpClient: HttpClient, private router: Router) { }

  /* Para iniciar la sesion y guardar el token y el nombre de usuario en el localstorage */
  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          console.log(response.token);
          this.setToken(response.token);
          this.setUsername(response.user.name); // Asegúrate de que `response.user.name` contiene el nombre de usuario
        }
      }),
      catchError(this.handleError)
    );
  }

  /* Para asignarle el token de la BD al localstorage */
  private setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    } else {
      console.warn('localStorage is not defined');
    }
  }

  /* Para asignar el nombre de usuario al localstorage */
  private setUsername(username: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.usernameKey, username);
    } else {
      console.warn('localStorage is not defined');
    }
  }

  /* Para obtener el token del logueado desde el localstorage */
  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      console.warn('localStorage is not defined');
      return null;
    }
  }

  /* Para obtener el nombre de usuario del logueado desde el localstorage */
  getUsername(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.usernameKey);
    } else {
      console.warn('localStorage is not defined');
      return null;
    }
  }

  /* Para confirmar que este loggeado */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return true;
  }

  /* Para cerrar la sesion y eliminar el token y el nombre de usuario */
  logout(): void {
    const token = this.getToken();

    if (token) {
      this.httpClient.post(this.LOGOUT_URL, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        () => {
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem(this.usernameKey);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error during logout', error);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  /* Para registrar usuarios nuevos */
  register(userData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<any>(this.REGISTER_URL, userData, { headers });
  }

  /* Para consultar todos los usuarios */
  getData(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<any[]>(this.CONSULT_USERS, { headers });
  }

  /* Manejo de errores */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 403) {
      return throwError('Your account has been disabled.');
    } else if (error.status === 401) {
      return throwError('Invalid credentials.');
    } else {
      return throwError('An unknown error occurred.');
    }
  }

  /* Para cambiar el estatus del usuario */
  toggleUserStatus(userId: number, isActive: boolean): Observable<any> {
    const token = this.getToken();
    const url = `http://127.0.0.1:8000/api/users/${userId}/status`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.put<any>(url, { is_active: isActive }, { headers });
  }

  /* Para eliminar un usuario */
  deleteUser(userId: number): Observable<any> { 
    const token = this.getToken(); 
    const url = `http://127.0.0.1:8000/api/users/${userId}`; 
    
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    }); 
    
    return this.httpClient.delete<any>(url, { headers }); 
  }

  // Método para enviar el enlace de recuperación de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.forgotPss}`, { email });
  }

  // Método para restablecer la contraseña
  resetPassword(token: string, password: string, passwordConfirmation: string): Observable<any> {
    return this.httpClient.post(`${this.resetPass}`, {
      token,
      password,
      password_confirmation: passwordConfirmation
    });
  }

}
