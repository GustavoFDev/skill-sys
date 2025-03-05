import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RazonamientologService {
  private LOGICO_URL = 'http://127.0.0.1:8000/api/razonamiento_logico'; 

  constructor(private httpClient: HttpClient, private router: Router) { }

  getRazonamientoByApplicantId(applicantId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.LOGICO_URL}/applicant/${applicantId}`);
  }

  sendFormData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.LOGICO_URL, data, { headers });
  }

  updateFormData(applicantId: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.patch(`${this.LOGICO_URL}/update/${applicantId}`, data, { headers });
  }
  
}
