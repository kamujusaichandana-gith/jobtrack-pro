import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application';
import { Application } from '../../../core/models/application.model';
import { Router } from '@angular/router';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-application-form',
  styleUrl: './application-form.scss',
  templateUrl: './application-form.html',
})
export class ApplicationForm {
  private applicationService = inject(ApplicationService);
  private router = inject(Router);

  applicationForm = new FormGroup({
    company: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    dateApplied: new FormControl('', Validators.required)
  });

  onSubmit() {

    if (this.applicationForm.valid) {

      const formValue = this.applicationForm.getRawValue();

      const newApplication: Application = {
        id: Date.now().toString(),
        company: formValue.company ?? '',
        position: formValue.position ?? '',
        location: formValue.location ?? '',
        status: formValue.status ?? 'Applied',
        dateApplied: formValue.dateApplied ?? ''
      };

      this.applicationService.addApplication(newApplication).subscribe({
        next: (savedApplication) => {
          this.router.navigate(['/applications']);
        },
        error: (error) => {
          console.error('ERROR SAVING APPLICATION:', error);
      }
      });
      this.applicationForm.reset({
        company: '',
        position: '',
        location: '',
        status: 'Applied',
        dateApplied: ''
      });

    }
  }
}
