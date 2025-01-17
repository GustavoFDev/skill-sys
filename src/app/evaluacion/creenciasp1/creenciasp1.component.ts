import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreenciaspDialogComponent } from '../../help-dialog/creenciasp-dialog/creenciasp-dialog.component';
import { CreenciaspService } from '../../core/services/creenciasp/creenciasp.service';
import { ApplicantService } from '../../core/services/applicant.service';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
import { QuizCards1Component } from '../../components/quiz-cards/quiz-cards1/quiz-cards1.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creenciasp1',
  standalone: true,
  imports: [CommonModule, QuizCards1Component, MatButtonModule, MatIconModule], 
  templateUrl: './creenciasp1.component.html',
  styleUrl: './creenciasp1.component.css'
})

export class Creenciasp1Component implements OnInit {
  step: number = 1;
  countdown: number = 300; // Tiempo en segundos
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; // Control de visibilidad del temporizador
  sliderValues: number[] = []; 
  responses: { [key: string]: number | string | { minutes: number; seconds: number } } = {}; 

  constructor(public dialog: MatDialog, private creenciaspService: CreenciaspService, private applicantService: ApplicantService, private router : Router) { }

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
    this.dialog.open(QuizCards1Component);
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
    const responseKey = `mcp2_${index + 1}`;
    this.responses[responseKey] = value;
  }

  finishDialog(){
    this.openFinishDialog();
  }

  finish() {
    console.log('Finalizando el proceso...');
  
    // Preguntas no respondidas
    for (let i = 1; i <= 33; i++) { 
      const responseKey = `mcp2_${i}`;
      if (!(responseKey in this.responses)) {
        this.responses[responseKey] = 50;
      }
    }
  
    // Tiempo restante
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
  
    console.log('Respuestas finales con tiempo restante:', JSON.stringify(this.responses, null, 2));
    this.step = 11;  
  
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.sendResponsesToServer();
    this.router.navigate(['/creencias_personales3']);
  }
  
  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        this.finish();
      }
    });
  }
  
  sendResponsesToServer(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId; 
    }

    this.creenciaspService.sendFormData1(this.responses).subscribe(
      {
      next : (response) => {
        console.log('Datos enviados correctamente:', response);
      },
      error : (error) => {
        console.error('Error al enviar los datos:', error);
      }
    }
    );
  }

}
/*Mod*/