import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConteoCardsComponent } from '../../components/quiz-cards/conteo-cards/conteo-cards.component';

@Component({
  selector: 'app-conteo-fig',
  imports: [CommonModule, MatButtonModule, ConteoCardsComponent, MatIconModule],
  templateUrl: './conteo-fig.component.html',
  styleUrl: './conteo-fig.component.css'
})
export class ConteoFigComponent {
  step: number = 1;
  currentStep: number = 1; // Iniciar en 1 para que coincida con el paso inicial

  previousStep(): void { // Atrás
    if (this.step > 1) {
      this.step--;
      this.currentStep = this.step; // Actualiza currentStep cuando retrocedas
    }
  }

  nextStep(): void { // Siguiente
    if (this.step <= 3) {
      this.step++;
      this.currentStep = this.step; // Actualiza currentStep cuando avances
    }
  }

  okNext(): void {
    if (this.step <= 3) {
      this.step++;
      this.currentStep = this.step; // Actualiza currentStep cuando avances
    }
  }
}
