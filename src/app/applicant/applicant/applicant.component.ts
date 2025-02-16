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
import { trigger, transition, style, animate } from '@angular/animations';

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
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ApplicantComponent implements OnInit {
  isLinear = true;
  isLoading = false;
  showStepper = false;       // Controla la visibilidad del formulario (stepper)
  showRFCPrompt = false;     // Controla si se muestra el recuadro para ingresar el RFC
  rfcInput = "";             // Almacena el RFC ingresado en el prompt

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

  // Inicia directamente el test (nuevo test)
  startNewTest(): void {
    this.showStepper = true;
  }

  // Al presionar "Continuar test" se muestra el recuadro para ingresar el RFC
  continueTest(): void {
    this.showRFCPrompt = true;
  }

  // Al presionar "Ingresar", se valida que se haya ingresado un RFC y se inicia el test
  // Al presionar "Ingresar", se valida que se haya ingresado un RFC y se consulta el applicant por RFC
  ingresarRFC(): void {
    if (this.rfcInput.trim().length === 0) {
      alert("Por favor ingresa tu RFC");
      return;
    }

    this.isLoading = true;

    this.applicantService.getApplicantByRFC(this.rfcInput).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        if (response && response.status) {
          
          switch (response.status) {
            case 0:
              this.router.navigate(['/creencias_personales1']);
              break;
            case 1:
              this.router.navigate(['/escenarios_realistas']);
              break;
            case 2:
              this.router.navigate(['/creencias_personales2']);
              break;
            case 3:
              this.router.navigate(['/razonamiento_logico']);
              break;
            case 4:
              this.router.navigate(['/creencias_personales3']);
              break;
            case 5:
              this.router.navigate(['/razonamiento_numerico']);
              break;
            case 6:
              this.router.navigate(['/creencias_personales4']);
              break;
            // Añadir más casos según los valores de status y las rutas correspondientes
            default:
              this.router.navigate(['/default']);
          }
        } else {
          alert('RFC no encontrado o sin estado válido.');
        }
      },
      error: (error) => {
        console.error('Error al consultar el RFC:', error);
        alert('Hubo un error al consultar el RFC. Intenta nuevamente.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  generateRFC(): void {
    const name = this.firstFormGroup.get('name_a')?.value || '';
    const surnameP = this.firstFormGroup.get('surname_p')?.value || '';
    const surnameM = this.firstFormGroup.get('surname_m')?.value || '';
    const birthDate = this.firstFormGroup.get('b_date')?.value || '';

    if (!name || !surnameP || !surnameM || !birthDate) {
      console.error('Datos incompletos para generar el RFC');
      return;
    }

    const [firstLastName, secondLastName, firstName] = this.splitFullName(surnameP, surnameM, name);
    const rfcName = this.generateNamePart(firstLastName, secondLastName, firstName);
    const rfcDate = this.generateBirthDate(birthDate);
    const rfc = rfcName + rfcDate;
    this.fourthFormGroup.get('rfc')?.setValue(rfc);
  }

  generateNamePart(firstLastName: string, secondLastName: string, firstName: string): string {
    return this.getFirstLetter(firstLastName) +
      this.getFirstVowel(firstLastName) +
      this.getFirstLetter(secondLastName) +
      this.getFirstLetter(firstName);
  }

  generateBirthDate(date: string): string {
    const birthDate = new Date(date);
    const year = birthDate.getFullYear().toString().slice(-2);
    const month = ('0' + (birthDate.getMonth() + 1)).slice(-2);
    const day = ('0' + birthDate.getDate()).slice(-2);
    return year + month + day;
  }

  splitFullName(surnameP: string, surnameM: string, name: string): [string, string, string] {
    return [surnameP, surnameM, name];
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
    return 'X';
  }

  onSubmit(): void {
    this.isLoading = true;

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
        this.isLoading = false;
      }
    });
  }

  convertToUppercase(controlName: string): void {
    if (controlName === 'rfc') {
      this.rfcInput = this.rfcInput.toUpperCase();
    } else {
      let control = this.firstFormGroup.get(controlName) ||
                    this.secondFormGroup.get(controlName) ||
                    this.thirdFormGroup.get(controlName) ||
                    this.fourthFormGroup.get(controlName);
  
      if (control) {
        control.setValue(control.value.toUpperCase(), { emitEvent: false });
      }
    }
  }
  
  
}
