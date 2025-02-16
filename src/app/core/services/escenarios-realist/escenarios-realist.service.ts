import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EscenariosRealistService {

    private ER_URL = 'http://127.0.0.1:8000/api/escenariosRealistas'; 
  
    constructor(private httpClient: HttpClient, private router: Router) { }
  
    getRazonamientoByApplicantId(applicantId: string): Observable<any> {
      return this.httpClient.get<any>(`${this.ER_URL}/applicant/${applicantId}`);
    }
  
    sendFormData(data: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.httpClient.post(this.ER_URL, data, { headers });
    }
    
}
