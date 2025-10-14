import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class cmisService {
  private apiUrl = environment.apiBaseUrl; // adjust port if needed

  constructor(private http: HttpClient) {}

  
 getFolderFiles() {

   
  return  this.http.get<any[]>(`${this.apiUrl}/cmis/folder`);
}

}