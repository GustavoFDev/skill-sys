import { Component, OnInit, ViewChild } from '@angular/core';
import { NumberCardsComponent } from '../../components/quiz-cards/number-cards/number-cards.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { RazonamientonumService } from '../../core/services/razonamientonum.service';
import { ApplicantService } from '../../core/services/applicant.service';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-razonamientonum',
  standalone: true,
  imports: [NumberCardsComponent, CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatCardModule],
  templateUrl: './razonamientonum.component.html',
  styleUrls: ['./razonamientonum.component.css']
})
export class RazonamientonumComponent implements OnInit {
  @ViewChild(NumberCardsComponent) numberCardsComponent!: NumberCardsComponent;
  // Inicializaciones
  currentQuestion = 0;
  step = 1; 
  selectedOptions: (number | null)[] = Array(10).fill(null);
  results: number[] = Array(10).fill(0);
  showMessage = false;
  countdown: number = 600; // Tiempo en segundos
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; // Control de visibilidad del temporizador
  responses: { [key: string]: string | number } = {}; // Acepta tanto string como number
  previousStepValue: number = 1;
  previousCountdown: number = 600;

  constructor(public dialog: MatDialog, private razonamientonumService: RazonamientonumService, private applicantService: ApplicantService, private router: Router) {}


// aqui tengo funciones del timer para iniciar, checar los minutos, segundos etc
  startCountdown() {
    this.countdownSubscription = interval(1000).pipe(
      take(this.countdown)
    ).subscribe(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.finish();
      }
    });
  }
  get minutes(): number {
    return Math.floor(this.countdown / 60);
  }
  get seconds(): number {
    return this.countdown % 60;
  }
  toggleTimer(): void {
    this.showTimer = !this.showTimer;
  }

  // Triggers para sig, atras, del stepper
  nextStep() {
    this.showMessage = false; // Inicializar en falso el mensaje
    if (this.step === 1 || this.step === 2) { // Se guardan las respuestas seleccionadas en el step actual antes de cambiar
      this.step++; 
    } else if (this.step >= 3 && this.step <= 12) {
      if (this.currentQuestion < 9) {
        if (this.numberCardsComponent) {
          this.selectedOptions[this.currentQuestion] = this.numberCardsComponent.selectedOption;
        }
        this.saveResult();
        this.currentQuestion++;
        this.step++;
        this.updateSelection();
      }
    } else if (this.step === 13) {
      this.step = 14; // Ir al paso final
    }
    if (this.step > 2) {
      this.saveState();
    }
    if (this.step === 2) {
      this.startCountdown();
    }
  }

  okNext(): void {
    this.showMessage = false; // Inicializar en falso el mensaje
    if (this.previousStepValue === undefined || this.previousStepValue === 1) {
      this.step = 2;  // Step 2 por defecto
    } else {
      this.step = this.previousStepValue;  // Si hay valor previo, mandamos a ese step
    }
    if (this.step >= 2) {
      this.startCountdown();
      this.showTimer = true;
    }
  }

  previousStep() { // Muestra el step anterior al actual con la información que se guardó con anterioridad
    if (this.step > 1) { 
      if (this.step >= 3 && this.step <= 12) {
        this.currentQuestion--;
        this.updateSelection();
      }
      this.step--;
    }
  }

  // aqui mero se abre el dialogo de ayudita 
  openHelpDialog(): void {
    // Estado actual 
    this.previousStepValue = this.step;
    this.previousCountdown = this.countdown;

     // Regresamos al step 1 y pausamos el contador
     this.step = 1;
     this.showTimer = false;
     if (this.countdownSubscription) {
       this.countdownSubscription.unsubscribe(); 
     }
  }

  closeHelp(): void {
    // Restauramos el step y el tiempo
    this.step = this.previousStepValue;
    this.countdown = this.previousCountdown;

    if (this.step >= 2) {
      this.startCountdown();
      this.showTimer = true; 
    }
  }

  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        this.finish();
      }
    });
  }

  updateSelection() {
    if (this.numberCardsComponent) {
      this.numberCardsComponent.selectedOption = this.selectedOptions[this.currentQuestion];
    }
  }

  //Aqui mero creamos el objeto con los valores de cada pregunta y se lo asignamos al "RESULTS"
  saveResult() { 
    const selectedOption = this.selectedOptions[this.currentQuestion];
    if (selectedOption === null) {
      this.results[this.currentQuestion] = 0; // Nulo
    } else if (selectedOption === this.numberCardsComponent.quizData[this.currentQuestion].correct) {
      this.results[this.currentQuestion] = 1; // Correcto
    } else {
      this.results[this.currentQuestion] = 2; // Incorrecto
    }
  }

  finish() { 
    this.selectedOptions[this.currentQuestion] = this.numberCardsComponent.selectedOption;
    this.saveResult();
//le asignamos las respuestas a results
    for (let i = 0; i < 10; i++) {
      this.responses[`mrn_${i + 1}`] = this.results[i] || 0;
    }
    // le asignamos el tiempo restante a results y el step
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
    this.responses['current_step'] = this.step;

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId; 
    }
    this.razonamientonumService.sendFormData(this.responses).subscribe(
      {
        next : (response) => {
          this.router.navigate(['/creencias_personales4']);
        },
        error : (error) => {
          console.error('Error al enviar los datos:', error);
        }
      }
    );
  }

  //SOLO para mostrar el mensaje del ejemplo
  selectOption(option: number): void { 
    this.selectedOptions[this.currentQuestion] = option;
    if ((this.step === 1 && option === 5) || (this.step === 2 && option === 10)) {
      this.showMessage = true;
    } else {
      this.showMessage = false;
    }
  }  

    //Aqui guardo todo en el localstorage para ver como no perder el progreso

    saveState() {
      this.selectedOptions[this.currentQuestion] = this.numberCardsComponent.selectedOption;
      this.saveResult();
    
      for (let i = 0; i < 10; i++) {
        this.responses[`mrn_${i + 1}`] = this.results[i] || 0;
      }
    
      this.responses['selected_options'] = JSON.stringify(this.selectedOptions); // Guardar como string
      this.responses['remaining_time'] = this.minutes * 60 + this.seconds;
      this.responses['current_step'] = this.step;
    
      const applicantId = this.applicantService.getApplicantId();
      if (applicantId) {
        this.responses['applicant_id'] = applicantId;
      }
    
      localStorage.setItem('quizRN', JSON.stringify(this.responses));
    }
    
    
  
    ngOnInit() {
      this.applicantService.checkApplicantStatusAndRedirect();
      this.loadState();
    }
  
    loadState() {
      const savedState = localStorage.getItem('quizRN');
    
      if (savedState) {
        const state = JSON.parse(savedState);
        this.step = state.current_step || 1;
        this.countdown = state.remaining_time ?? 300;
    
        // Restaurar las opciones seleccionadas (convirtiéndolas de string a array)
        if (state.selected_options) {
          this.selectedOptions = JSON.parse(state.selected_options);
        }
    
        // Restaurar las respuestas previas en `results`
        for (let i = 0; i < 10; i++) {
          this.results[i] = state[`mrn_${i + 1}`] ?? 0;
        }
    
        // Restaurar la pregunta actual según el step
        if (this.step >= 3 && this.step <= 12) {
          this.currentQuestion = this.step - 3;
        }
    
        // Aplicar la selección guardada en el componente NumberCardsComponent
        if (this.numberCardsComponent) {
          this.updateSelection();
        }
    
        // Si ya está en un step activo, inicia el temporizador
        if (this.step > 2) {
          this.startCountdown();
        }
      }
    }
}
