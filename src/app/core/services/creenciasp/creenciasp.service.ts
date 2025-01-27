import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreenciaspService {
  //Consulta de respuestas con el id
  getCreenciasByApplicantId(applicantId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.CREENCIAS_URL}/applicant/${applicantId}`);
  }

  getCreenciasByApplicantId1(applicantId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.CREENCIAS1_URL}/applicant/${applicantId}`);
  }

  getCreenciasByApplicantId2(applicantId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.CREENCIAS2_URL}/applicant/${applicantId}`);
  }

  getCreenciasByApplicantId3(applicantId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.CREENCIAS3_URL}/applicant/${applicantId}`);
  }

  //Inicia la primer sección de creencias
  private CREENCIAS_URL = 'http://127.0.0.1:8000/api/creencias_personales1';

  constructor(private httpClient: HttpClient, private router: Router) { }

  sendFormData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.CREENCIAS_URL, data, { headers });
  }

  updateFormData(applicantId: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.patch(`${this.CREENCIAS_URL}/update/${applicantId}`, data, { headers });
  }
  //Aquí termina la primera sección de creencias

  //Inicia la segunda sección de creencias
  private CREENCIAS1_URL = 'http://127.0.0.1:8000/api/creencias_personales2';

  sendFormData1(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.CREENCIAS1_URL, data, { headers });
  }
  //Aquí termina la segunda sección de creencias

  //Inicia la tercera sección de creencias
  private CREENCIAS2_URL = 'http://127.0.0.1:8000/api/creencias_personales3';

  sendFormData2(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.CREENCIAS2_URL, data, { headers });
  }
  //Aquí termina la tercera sección de creencias

  //Inicia la tercera sección de creencias
  private CREENCIAS3_URL = 'http://127.0.0.1:8000/api/creencias_personales4';

  sendFormData3(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.CREENCIAS3_URL, data, { headers });
  }
  //Aquí termina la tercera sección de creencias
}





  

