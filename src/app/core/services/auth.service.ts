import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGIN_URL = 'http://127.0.0.1:8000/api/login';
  private LOGOUT_URL = 'http://127.0.0.1:8000/api/logout';
  private REGISTER_URL = 'http://127.0.0.1:8000/api/register';
  private CONSULT_USERS = 'http://127.0.0.1:8000/api/users-index';

  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient, private router: Router) { }

  /*  Para iniciar la sesion y guardar el token en el localstorage*/

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          console.log(response.token);
          this.setToken(response.token);
        }
      })
    )
  }

  /*  Para asignarle el token de la BD al localstorage */

  private setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    } else {
      console.warn('localStorage is not defined');
    }
  }

  /*  Para obetenr el token del logueado desde el localstorage */

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      console.warn('localStorage is not defined');
      return null;
    }
  }

  /*  Para confirmar que este loggeado */
  
  isAuthenticated(): boolean {
    const token = this.getToken(); 
    if (!token) {
      return false;
    } return true;
  }

  /*  Para cerrar la sesion y eliminar el token */

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


  /*  Para registrar usuarios nuevos */

  register(userData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<any>(this.REGISTER_URL, userData, { headers });
  }

  /*  Para consultar todos los usuarios */

    getData(): Observable<any> { 

      const token = this.getToken(); 
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      return this.httpClient.get<any[]>(this.CONSULT_USERS, { headers }); }

}
