import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreenciaspDialogComponent } from '../../help-dialog/creenciasp-dialog/creenciasp-dialog.component';
import { QuizCardsComponent } from '../../components/quiz-cards/quiz-cards.component'; 
import { CreenciaspService } from '../../core/services/creenciasp/creenciasp.service';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';


@Component({
  selector: 'app-creenciasp',
  standalone: true,
  imports: [CommonModule, QuizCardsComponent, MatButtonModule, MatIconModule], 
  templateUrl: './creenciasp.component.html',
  styleUrls: ['./creenciasp.component.css']
})
export class CreenciaspComponent implements OnInit {
  step: number = 1;
  countdown: number = 300; //Tiempo en segundos
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; // Control de visibilidad del temporizador
  sliderValues: number[] = []; 
  responses: { [key: string]: number | { minutes: number; seconds: number } } = {}; 

  constructor(public dialog: MatDialog, private creenciaspService: CreenciaspService) { }

  ngOnInit() {
    for (let i = 0; i < 51; i++) {
      this.sliderValues.push(50);
    }
  }

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

  openHelpDialog(): void {
    this.dialog.open(CreenciaspDialogComponent);
  }

  quizCards(): void {
    this.dialog.open(QuizCardsComponent);
  }
  
  nextStep(): void {
    if (this.step < 17) { 
      this.step++;
      if (this.step === 2) {
        this.startCountdown();
      }
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  saveResponse(index: number, value: number): void {
    const responseKey = `mcp1_${index}`;
    this.responses[responseKey] = value;
  }

  finish() {
    console.log('Finalizando el proceso...');
  
    // Valor de las preguntas no respondidas
    for (let i = 0; i < this.sliderValues.length; i++) {
      const responseKey = `mcp1_${i}`;
      if (!(responseKey in this.responses)) {
        this.responses[responseKey] = 50;
      }
    }
  
    // Tiempo restante
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
  
    console.log('Respuestas finales con tiempo restante:', JSON.stringify(this.responses, null, 2));
    this.step = 17;  
  
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  
    
    this.openFinishDialog();
    this.sendResponsesToServer();
  }
  
  openFinishDialog(): void {
    this.dialog.open(FinishDialogComponent);
  }
  
  sendResponsesToServer(): void {
    this.creenciaspService.sendFormData(this.responses).subscribe(
      response => {
        console.log('Datos enviados correctamente:', response);
      },
      error => {
        console.error('Error al enviar los datos:', error);
      }
    );
  }
}
