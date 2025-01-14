import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreenciaspService {
  private CREENCIAS_URL = 'http://127.0.0.1:8000/api/creencias_personales'; 

  constructor(private httpClient: HttpClient, private router: Router) {
   }

   sendFormData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.CREENCIAS_URL, data, { headers });
  }  

  getData(): Observable<any> {
    return this.httpClient.get<any[]>(this.CREENCIAS_URL);
  }
}
