import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ApplicantService } from '../../core/services/applicant.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  isLinear = true;
  private _formBuilder = inject(FormBuilder);
  constructor(private applicantService: ApplicantService, private router: Router){ }

  firstFormGroup = this._formBuilder.group({
    name_a: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]],
    surname_p: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    surname_m: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    b_date: ['', Validators.required],
    gender: ['', Validators.required],
});

secondFormGroup = this._formBuilder.group({
    street: ['', Validators.required],
    number: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    col: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    postal_code: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]], 
});

thirdFormGroup = this._formBuilder.group({
    day_phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
    night_phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
    email_a: ['', [Validators.required, Validators.email]],
});

fourthFormGroup = this._formBuilder.group({
    rfc: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{10,13}$')]], 
    employee: [null, Validators.required],
    former_employee: [null, Validators.required],
});


  ngOnInit(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.router.navigate(['/creencias_personales1']);
    }
  }

  onSubmit(): void {

    const formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      ...this.fourthFormGroup.value,
    };

    this.applicantService.sendFormData(formData).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        this.router.navigate(['/creencias_personales1']);
      },
      error: (error) => {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar los datos. Intenta nuevamente.');
      },
    });
    
  }
}
