import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ApplicantService } from '../../core/services/applicant.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { Router } from '@angular/router';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent {
  isLinear = true;
  private _formBuilder = inject(FormBuilder);
  constructor(private applicantService: ApplicantService, private router: Router){ }

  firstFormGroup = this._formBuilder.group({
    name_a: ['', Validators.required],
    surname_p: ['', Validators.required],
    surname_m: ['', Validators.required],
    email_a: ['', [Validators.required, Validators.email]],
  });

  secondFormGroup = this._formBuilder.group({
    street: ['', Validators.required],
    number: ['', Validators.required],
    col: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    postal_code: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    day_phone: ['', Validators.required],
    night_phone: ['', Validators.required],
    b_date: ['', Validators.required],
  });

  fourthFormGroup = this._formBuilder.group({
    employee: [null, Validators.required],
    former_employee: [null, Validators.required],
  });

  onSubmit(): void {
    const formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      ...this.fourthFormGroup.value,
    };

    // Imprimir en consola los datos que se van a enviar
  console.log('Datos que se van a enviar:', formData);
    
    this.applicantService.sendFormData(formData).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        alert('Formulario enviado correctamente.');
      },
      error: (error) => {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar los datos. Intenta nuevamente.');
      },
    });

  }
}
