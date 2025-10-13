import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnboardingService } from './onboarding.service';
import { ClientfilesComponent } from '../clientfiles/clientfiles.component';


@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ClientfilesComponent],
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent {
  onboardingForm: FormGroup;
  
  
 cinFrontFile: File | null = null;
  cinBackFile: File | null = null;

  constructor(private fb: FormBuilder, private service: OnboardingService) {
    this.onboardingForm = this.fb.group({
      Login: ['dali', Validators.required],
      Password: ['123', Validators.required],
      FirstName: ['Ali', Validators.required],
      LastName: ['Said', Validators.required],
      BirthDate: ['2000/01/26', Validators.required],
      CIN: ['12345678', Validators.required],
      BankCardNumber: ['1234567890123456', Validators.required],
      ExpiryDate: ['01/26', Validators.required],
      AccountNumber: ['01234567890123456789', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
    });
  }
  
  


   onFileSelected(event: Event, side: 'front' | 'back') {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0] ?? null;

    if (side === 'front') this.cinFrontFile = file;
    else this.cinBackFile = file;
  }

  submitForm() {
    if (this.onboardingForm.invalid) {
      alert('Please fill all fields');
      return;
    }

    this.service.submitOnboarding(this.onboardingForm.value).subscribe({
      next: () => alert('Client saved successfully'),
      error: (err) => alert('Error: ' + err.message)
    });
 this.service.uploadFiles(this.onboardingForm.value, this.cinFrontFile!, this.cinBackFile!)
          .subscribe({
            next: () => alert('Onboarding complete!'),
            error: (err) => alert('Error uploading files: ' + err.message)
          });
          

  }

    submitMockData() {
   

    this.service.submitOnboarding(this.onboardingForm.value).subscribe({
      next: () => alert('Client saved successfully'),
      error: (err) => alert('Error: ' + err.message)
    });
 this.service.uploadFiles(this.onboardingForm.value, this.cinFrontFile!, this.cinBackFile!)
          .subscribe({
            next: () => alert('Onboarding complete!'),
            error: (err) => alert('Error uploading files: ' + err.message)
          });
          

  }
  





 

}