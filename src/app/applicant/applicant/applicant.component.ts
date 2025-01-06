import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.css'],
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
})
export class ApplicantComponent {
  private _formBuilder = inject(FormBuilder);
  private authService = inject(AuthService); // Cambiamos a AuthService

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

  isLinear = false;

  onSubmit(): void {
    const formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      ...this.fourthFormGroup.value,
    };
    
    this.authService.sendFormData(formData).subscribe({
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
