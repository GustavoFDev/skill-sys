import { Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LogicCardsComponent } from '../../components/quiz-cards/logic-cards/logic-cards.component';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
import { ApplicantService } from '../../core/services/applicant.service';
import { RazonamientologService } from '../../core/services/razonamientolog.service';
import { MatCardContent, MatCardFooter, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
      
@Component({
  selector: 'app-razonamientolog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, LogicCardsComponent, MatDividerModule, MatIconModule, MatCardModule, MatCardContent, MatCardFooter],
  templateUrl: './razonamientolog.component.html',
  styleUrls: ['./razonamientolog.component.css'],
})
export class RazonamientologComponent {
  @ViewChild(LogicCardsComponent) logicCardsComponent!: LogicCardsComponent;

  step = 1;
  selectedResponses: number[] = Array(16).fill(null);  // Respuestas seleccionadas [0, 1, 2, 3]
  responseStatus: number[] = [];  // Estado de las respuestas [0, 1, 2]
  responses: { [key: string]: string | number } = {};
  countdown: number = 600; // Tiempo (10 minutos)
  countdownSubscription: Subscription = new Subscription();
  showTimer: boolean = true;
  showMessage: boolean = false;
  showHelpMessage: boolean = false;
  showExplanation: boolean = false;
  previousStepValue: number = 1;
  previousCountdown: number = 600;
  isHelpActive: boolean = false;
  mensajeMostrado: boolean = false;

  constructor(
    public dialog: MatDialog,
    private razonamientologService: RazonamientologService,
    private applicantService: ApplicantService,
    private router: Router
  ) {}

  startCountdown() {
    this.countdownSubscription = interval(1000).pipe(take(this.countdown)).subscribe(() => {
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

  openHelp(): void {
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

  help(): void {
    this.showMessage = false;
    this.showHelpMessage = true; 
    this.showExplanation = true;
    this.logicCardsComponent.help(); 
  }

  onCorrectAnswer(isCorrect: boolean): void {
    // Solo se muestra si la respuesta es correcta, estamos en el step 1 y aún no se mostró el mensaje
    if (isCorrect && this.step === 1 && !this.mensajeMostrado) {
      this.showMessage = true;
      this.mensajeMostrado = true; // Se marca que ya se mostró
    }
  }
  

  previousStep(): void { // Atrás
    if (this.step > 1) {
      this.step--;
    }
  }

  nextStep(): void { // Siguiente
    if (this.step < 16) {
      this.step++;
      this.saveCurrentStepResponses();// Enviar respuestas antes de avanzar
    }
  
    if (this.step === 2) {
      this.startCountdown();
    }
  
    // Solo guardar si hay cambios en las respuestas
    const hasChanges = this.selectedResponses.some((response, index) => response !== this.responseStatus[index]);
    if (hasChanges) {
      this.saveState();
    }
  }
  
  okNext(): void {
    this.mensajeMostrado = false;
    this.showMessage = false;
    this.showHelpMessage = false;
    this.showExplanation = false;
    
    if (this.previousStepValue === undefined || this.previousStepValue === 1) {
      this.step = 2;  // Step 2 por defecto
    } else {
      this.step = this.previousStepValue;  // Si hay valor previo, se regresa a ese step
    }
    if (this.step >= 2) {
      this.startCountdown();
      this.showTimer = true;
    }
    // Si es el primer step, crear el registro en la base de datos
    if (this.step === 2) {
      this.createInitialRecord();
    }
  }
  
  createInitialRecord(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;
  
    // Valores iniciales por defecto
    const initialResponses: { [key: string]: number } = {};
    for (let i = 1; i <= 15; i++) {
      initialResponses[`mrl_${i}`] = 0; // Valor por defecto
    }
  
    const initialData = {
      ...initialResponses,
      remaining_time: this.countdown,
      current_step: this.step,
      applicant_id: applicantId,
      selected_options: [] // Inicializar como array vacío
    };
  
    this.razonamientologService.sendFormData(initialData).subscribe({
      next: (response) => {
        console.log('Registro inicial creado en la BD:', response);
      },
      error: (error) => {
        console.error('Error al crear el registro inicial:', error);
      }
    });
  }
  

  saveCurrentStepResponses(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;
  
    const questionNumber = this.step - 2; // Ajuste correcto para la numeración
    if (questionNumber < 1 || questionNumber > 15) return;
  
    const responseKey = `mrl_${questionNumber}`;
    const responseValue = this.responseStatus[questionNumber] !== undefined ? this.responseStatus[questionNumber] : 0;
  
    console.log(`Pregunta: ${questionNumber}, Clave: ${responseKey}, Valor: ${responseValue}`);
  
    // Aquí usamos directamente el array de respuestas seleccionadas
    const updateData = {
      [responseKey]: responseValue,
      current_step: this.step,
      remaining_time: this.countdown,
      selected_options: this.selectedResponses // Usamos el array existente
    };
  
    console.log('Enviando respuesta:', updateData);
  
    this.razonamientologService.updateFormData(applicantId, updateData).subscribe({
      next: (response) => {
        console.log(`Respuesta ${responseKey} enviada correctamente:`, response);
      },
      error: (error) => {
        console.error('Error al actualizar la respuesta:', error);
      }
    });
  }
  
  
  // Implementa este método para obtener la opción seleccionada
  getSelectedOption(questionNumber: number): number | null {
    // Lógica para obtener la opción seleccionada en base al questionNumber
    // Devuelve el número de la opción seleccionada o null si no hay opción
    return this.responseStatus[questionNumber]; // Modifica según tu lógica
  }
  

  
  
  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        this.finish();
      }
    });
  }

  finish(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;
  
    const questionNumber = this.step - 1; // Ajuste correcto para la numeración
    if (questionNumber < 1 || questionNumber > 15) return;
  
    const responseKey = `mrl_${questionNumber}`;
    const responseValue = this.responseStatus[questionNumber] !== undefined ? this.responseStatus[questionNumber] : 0;
  
    console.log(`Pregunta: ${questionNumber}, Clave: ${responseKey}, Valor: ${responseValue}`);
  
    // Aquí usamos directamente el array de respuestas seleccionadas
    const updateData = {
      [responseKey]: responseValue,
      current_step: this.step,
      remaining_time: this.countdown,
      selected_options: this.selectedResponses // Usamos el array existente
    };
    
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  
    this.razonamientologService.updateFormData(applicantId, updateData).subscribe(
      {
        next: (response) => {
          console.log('Datos enviados correctamente:', response);
          this.router.navigate(['/creencias_personales3']); //Ruta del siguiente módulo
        },
        error: (error) => {
          console.error('Error al enviar los datos:', error);
        }
      }
    );
}

ngOnInit() {
  this.applicantService.checkApplicantStatusAndRedirect();
  this.loadOrFetchState();
}

  loadState() {
    const savedState = localStorage.getItem('quizLog');
  
    if (savedState) {
      const state = JSON.parse(savedState);
      this.step = state.current_step || 1;
      this.countdown = state.remaining_time || 600;
      this.responses = state;
  
      // Se recuperan las respuestas seleccionadas
      if (state.selected_options) {
        this.selectedResponses = JSON.parse(state.selected_options);
      } else {
        this.selectedResponses = Array(16).fill(null);  // Inicia en null
      }
  
      this.responseStatus = this.selectedResponses.map((response, index) => {
        // Si hay una respuesta guardada la utiliza, si no hay deja el valor actual
        return response !== null
            ? (this.responses[`mrl_${index}`] !== undefined 
                ? Number(this.responses[`mrl_${index}`]) 
                : this.responseStatus[index]) // Mantiene el valor si no hay dato nuevo
            : 0;
      });
    
      // Reiniciar la cuenta regresiva
      if (this.step > 2) {
        this.startCountdown();
      }
    } else {
      console.log('No se encontró estado guardado en localStorage.');
      this.step = 1;
      this.countdown = 600;
      this.selectedResponses = Array(16).fill(null);
    }
  }
  
  saveResponse(index: number, value: number, isCorrect: boolean) {

    const adjustedIndex = index - 1;

    if (this.responseStatus[adjustedIndex] !== value) {
        // Actualizar respuestas seleccionadas
        this.selectedResponses[adjustedIndex] = value;

        // Estado de la respuesta
        let responseStatusValue = 0; // 0 Nulo
        if (isCorrect) {
            responseStatusValue = 1; // 1 Correcto
        } else if (value !== null) {
            responseStatusValue = 2; // 2 Incorrecto
        }

        this.responseStatus[adjustedIndex] = responseStatusValue;
        this.responses[`mrl_${index}`] = responseStatusValue;
        this.saveState();
    }
  }

  saveState() {

    // Verifica si las respuestas han cambiado antes de guardar el estado
    const hasChanges = this.selectedResponses.some((response, index) => response !== this.responseStatus[index]);

    if (!hasChanges) {
        console.log('No se han realizado cambios en las respuestas. El estado no se guardará.');
        return;  
    }

    // Guardar solo respuestas que han sido seleccionadas 
    for (let i = 1; i < this.selectedResponses.length; i++) {
        if (this.selectedResponses[i] !== null) {
            this.responses[`mrl_${i}`] = this.responseStatus[i] || 0;
        } else{
          this.responses[`mrl_${i}`] = 0; // 0 si es nulo
        }
    }

    // Guardar el tiempo restante
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
    this.responses['current_step'] = this.step;

    // Guardar las respuestas seleccionadas como JSON
    this.responses['selected_options'] = JSON.stringify(this.selectedResponses);

    // Guardar el ID del solicitante
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
        this.responses['applicant_id'] = applicantId;
    }

    // Guardar en localStorage
    localStorage.setItem('quizLog', JSON.stringify(this.responses));
  }

  loadOrFetchState() {
    const savedState = localStorage.getItem('quizLog');
  
    if (savedState) {
      this.loadState(); // Si existe en localStorage, lo carga directamente
    } else {
      const applicantId = this.applicantService.getApplicantId();
      if (!applicantId) return;
  
      this.razonamientologService.getRazonamientoByApplicantId(applicantId).subscribe({
        next: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            const formattedData = { ...data[0] }; // Tomar el primer elemento del array
  
            // Eliminar propiedades innecesarias
            delete formattedData.applicant_id;
            delete formattedData.id;
            delete formattedData.created_at;
  
            // Convertir selected_options a string JSON antes de guardarlo
            if (Array.isArray(formattedData.selected_options)) {
              formattedData.selected_options = JSON.stringify(formattedData.selected_options);
            }
  
            // Guardar en localStorage
            localStorage.setItem('quizLog', JSON.stringify(formattedData));
            this.loadState(); // Cargar los datos del localStorage después de guardarlos
          }
        },
        error: (error) => {
          console.error('Error al obtener datos del servidor:', error);
        }
      });
    }
  }
  
  

}

