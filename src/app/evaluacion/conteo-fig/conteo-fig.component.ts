import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConteoCardsComponent } from '../../components/quiz-cards/conteo-cards/conteo-cards.component';
import { ApplicantService } from '../../core/services/applicant.service';
import { ConteofigService } from '../../core/services/conteofig/conteofig.service';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-conteo-fig',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ConteoCardsComponent, MatIconModule, MatCardModule],
  templateUrl: './conteo-fig.component.html',
  styleUrls: ['./conteo-fig.component.css']
})
export class ConteoFigComponent {
  step: number = 1;
  currentStep: number = 1;
  responses: { [key: string]: number | string | null } = {}; 
  showPractice = false;
  showOkButton = false;

  constructor(
    private conteofigService: ConteofigService,
    private applicantService: ApplicantService,
    private http: HttpClient
  ) {}

  startPractice() {
    this.showPractice = true;
    setTimeout(() => {
      this.showOkButton = true;
    }, 500); // Pequeño retraso para mostrar el botón después de activar la práctica
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
      this.currentStep = this.step;
    }
  }

  nextStep(): void {
    if (this.step <= 3) {
      this.step++;
      this.currentStep = this.step;
    }
  }

  okNext(): void {
    if (this.step <= 3) {
      this.step++;
      this.currentStep = this.step;
    }
  }

  processAnswer(data: { index: number; response: number | null; result: number }) {
    const key = `mcf_${data.index + 1}`;
    this.responses[key] = data.result;  // Guardamos `result` en vez de `response`
    console.log(` ${key}: ${data.result}`);
  }

  finish() {
    console.log('Finalizando el proceso...');
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId;
    }
  
    // Asegurarnos de que todas las claves mcf_1 a mcf_27 están presentes
    for (let i = 1; i <= 27; i++) {
      const key = `mcf_${i}`;
      // Si no se ha respondido, asignamos 0
      if (this.responses[key] === undefined || this.responses[key] === null) {
        this.responses[key] = 0;
      }
    }
  
    console.log(this.responses); // Mostrar las respuestas antes de enviarlas
  
    // Enviar los datos (tanto las respondidas como las no respondidas)
    this.conteofigService.sendFormData(this.responses).subscribe({
      next: (response) => {
        console.log('Datos enviados correctamente:', response);
        this.step = 3; // Cambiar a step 3 después de enviar
        this.currentStep = 3;
      },
      error: (error) => {
        console.error('Error al enviar los datos:', error);
      }
    });
  }
}
