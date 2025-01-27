import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  private APPLICANT_URL = 'http://127.0.0.1:8000/api/applicant';
  private applicantIdKey = 'applicantId';

  constructor(private httpClient: HttpClient, private router: Router) { }

  /* aquí registro a un aplicante nuevo */
  sendFormData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.APPLICANT_URL, data, { headers }).pipe(
      tap((response: any) => {
        if (response.id) {
          this.setApplicantId(response.id); // aqui mero guardo el id del usuario para que siga el quiz
        }
      })
    );
  }

  /* Aqui mero se guarda el id del usuario en el localStorage */
  private setApplicantId(id: string): void {
    localStorage.setItem(this.applicantIdKey, id);
  }

  /* para el gus del futuro, este te sirve para obtener el id del aplicante para las rutas y todo lo de guardar las respuestas */
  getApplicantId(): string | null {
    return localStorage.getItem(this.applicantIdKey);
  }

  /* Para el Gus del futuro, este te va a servir cuando terminen el quiz que borres el usuario y ya deje crearte uno nuevo*/
  clearApplicantId(): void {
    localStorage.removeItem(this.applicantIdKey);
  }

  /* Consultas generales */
  getData(): Observable<any> {
    return this.httpClient.get<any[]>(this.APPLICANT_URL);
  }
  getApplicantById(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.APPLICANT_URL}/${id}`);
  }
}
