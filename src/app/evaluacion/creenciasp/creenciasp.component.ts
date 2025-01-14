import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreenciaspDialogComponent } from '../../help-dialog/creenciasp-dialog/creenciasp-dialog.component';
import { QuizCardsComponent } from '../../components/quiz-cards/quiz-cards.component'; // Importa el componente

@Component({
  selector: 'app-creenciasp',
  standalone: true,
  imports: [CommonModule, QuizCardsComponent, MatButtonModule, MatIconModule], // Asegúrate de importar el componente
  templateUrl: './creenciasp.component.html',
  styleUrls: ['./creenciasp.component.css']
})
export class CreenciaspComponent implements OnInit {
  step: number = 1;
  countdown: number = 300; // 5 min
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; // Control de visibilidad del temporizador
  sliderValues: number[] = []; // Array para almacenar los valores de los controles deslizantes por pregunta
  responses: { [key: string]: number } = {}; // Objeto para almacenar las respuestas en el formato requerido

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // Inicializa los valores de los controles deslizantes a 50 para cada pregunta
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
    const responseKey = `mcp1_${index + 1}`;
    this.responses[responseKey] = value;
  }

  printResponses(): void { 
    console.log('Respuestas:', this.responses);
  }

  finish() {
    console.log('Proceso finalizado');
    console.log('Respuestas:', this.responses);
    this.step = 18; 
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
