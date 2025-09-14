import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private apiUrl = 'http://localhost:5122'; // adjust port if needed

  constructor(private http: HttpClient) {}

   submitOnboarding(formData: FormData) {
    return this.http.post(`${this.apiUrl}/onboarding`, formData, { responseType: 'json' });
  }

  uploadFiles(formData: any, cinFront: File, cinBack: File) {
    const formFiles = new FormData();
      const metadata = encodeURIComponent(JSON.stringify(formData));

    if (cinFront) formFiles.append('CinFront', cinFront);
    if (cinBack) formFiles.append('CinBack', cinBack);

    return this.http.post(`${this.apiUrl}/onboarding/files?metadata=${metadata}`, formFiles);
  }

}