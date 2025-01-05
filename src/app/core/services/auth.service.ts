import { HttpClient } from '@angular/common/http';
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
  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient, private router: Router) { }

  /*  Para iniciar la sesion y eguardar el token */

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

  private setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    } else {
      console.warn('localStorage is not defined');
    }
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      console.warn('localStorage is not defined');
      return null;
    }
  }


  isAuthenticated(): boolean {
    const token = this.getToken(); if (!token) {
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
  register(): void {

  }

}

