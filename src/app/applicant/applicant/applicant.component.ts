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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

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
    MatProgressSpinnerModule,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  isLinear = true;
  isLoading = false; // Variable para controlar el spinner
  private _formBuilder = inject(FormBuilder);

  constructor(private applicantService: ApplicantService, private router: Router) { }

  // Formularios para cada paso
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
    night_phone: ['', [Validators.pattern('^[0-9]{10}$')]],
    email_a: ['', [Validators.required, Validators.email]],
  });

  fourthFormGroup = this._formBuilder.group({
    rfc: ['', [Validators.required]],
    homoclave: ['', [Validators.pattern('^[a-zA-Z0-9]{3}$')]],  // Solo tres caracteres alfanuméricos
    employee: [null, Validators.required],
    former_employee: [null, Validators.required],
  });
  
  ngOnInit(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.router.navigate(['/creencias_personales1']);
    }
  }

  generateRFC(): void {
    const name = this.firstFormGroup.get('name_a')?.value || ''; // Primer nombre
    const surnameP = this.firstFormGroup.get('surname_p')?.value || ''; // Apellido paterno
    const surnameM = this.firstFormGroup.get('surname_m')?.value || ''; // Apellido materno
    const birthDate = this.firstFormGroup.get('b_date')?.value || ''; // Fecha de nacimiento

    if (!name || !surnameP || !surnameM || !birthDate) {
      console.error('Datos incompletos para generar el RFC');
      return;
    }

    // Generación de la parte del nombre
    const [firstLastName, secondLastName, firstName] = this.splitFullName(surnameP, surnameM, name);
    const rfcName = this.generateNamePart(firstLastName, secondLastName, firstName);

    // Generación de la parte de la fecha
    const rfcDate = this.generateBirthDate(birthDate);

    // Concatenación del RFC completo
    const rfc = rfcName + rfcDate;

    // Asignamos el RFC generado al campo
    this.fourthFormGroup.get('rfc')?.setValue(rfc);
  }

  generateNamePart(firstLastName: string, secondLastName: string, firstName: string): string {
    return this.getFirstLetter(firstLastName) + this.getFirstVowel(firstLastName) + this.getFirstLetter(secondLastName) + this.getFirstLetter(firstName);
  }

  generateBirthDate(date: string): string {
    const birthDate = new Date(date);
    const year = birthDate.getFullYear().toString().slice(-2); // Los últimos dos dígitos del año
    const month = ('0' + (birthDate.getMonth() + 1)).slice(-2); // Mes con ceros a la izquierda
    const day = ('0' + birthDate.getDate()).slice(-2); // Día con ceros a la izquierda

    return year + month + day;
  }

  splitFullName(surnameP: string, surnameM: string, name: string): [string, string, string] {
    return [surnameP, surnameM, name]; // Asumimos que el nombre completo es ya el desglosado
  }

  getFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase();
  }

  getFirstVowel(str: string): string {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    for (let i = 1; i < str.length; i++) {
      if (vowels.includes(str[i].toUpperCase())) {
        return str[i].toUpperCase();
      }
    }
    return 'X'; // Si no hay vocal interna, usamos 'X'
  }

  onSubmit(): void {
    this.isLoading = true; // Muestra el spinner
  
    const formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      rfc: `${this.fourthFormGroup.value.rfc}${this.fourthFormGroup.value.homoclave || ''}`,
      employee: this.fourthFormGroup.value.employee,
      former_employee: this.fourthFormGroup.value.former_employee,
      night_phone: this.thirdFormGroup.value.night_phone || 'NA',
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
      complete: () => {
        this.isLoading = false; // Oculta el spinner al terminar
      }
    });
  }
  
  convertToUppercase(controlName: string): void {
    const control = 
      this.firstFormGroup.get(controlName) || 
      this.secondFormGroup.get(controlName) || 
      this.thirdFormGroup.get(controlName) || 
      this.fourthFormGroup.get(controlName);
  
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }
  

  
}
