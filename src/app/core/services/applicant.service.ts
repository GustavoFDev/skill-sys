import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  private APPLICANT_URL = 'http://127.0.0.1:8000/api/applicant';

  constructor(private httpClient: HttpClient, private router: Router) { }

  /* Para registrar la informacion  del aplicante*/
  sendFormData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.APPLICANT_URL, data, { headers });
  }  
}
