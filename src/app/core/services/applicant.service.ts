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
  private applicantRFC = 'rfc';

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

  /* Nueva función para obtener un applicant por RFC */
  getApplicantByRFC(rfc: string): Observable<any> {
    return this.httpClient.get<any>(`${this.APPLICANT_URL}/rfc/${rfc}`).pipe(
      tap((response: any) => {
        if (response.id) {
          this.setApplicantId(response.id); // Asignar applicantId al localStorage
        }
      })
    );
  }

  /* Nueva función para obtener y redirigir según el estado del applicant */
  checkApplicantStatusAndRedirect(): void {
    const applicantId = this.getApplicantId();
    if (applicantId) {
      this.getApplicantById(applicantId).subscribe({
        next: (applicant: any) => {
          console.log('Respuesta de la API:', applicant);
          if (applicant && applicant.status !== undefined) {
            switch (applicant.status) {
              case 0:
                this.router.navigate(['/creencias_personales1']);
                break;
              case 1:
                this.router.navigate(['/escenarios_realistas']);
                break;
              case 2:
                this.router.navigate(['/creencias_personales2']);
                break;
              case 3:
                this.router.navigate(['/razonamiento_logico']);
                break;
              case 4:
                this.router.navigate(['/creencias_personales3']);
                break;
              case 5:
                this.router.navigate(['/razonamiento_numerico']);
                break;
              case 6:
                this.router.navigate(['/creencias_personales4']);
                break;
              // Añadir más casos según los valores de status y las rutas correspondientes
              default:
                this.router.navigate(['/default']);
            }
          } else {
            alert('ID de applicant no encontrado o sin estado válido.');
          }
        },
        error: (error) => {
          console.error('Error al consultar el applicantId:', error);
          alert('Hubo un error al consultar el applicantId. Intenta nuevamente.');
        }
      });
    } else {
      this.router.navigate(['/applicant']);
    }
  }
}
