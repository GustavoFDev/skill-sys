import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import conjuntos from './imagenes.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logic-cards',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './logic-cards.component.html',
  styleUrls: ['./logic-cards.component.css']
})
export class LogicCardsComponent implements OnChanges {
  @Input() step: number = 1;
  @Input() selectedResponses: number[] = [];  
  @Input() responseStatus: number[] = [];
  
  imagenesSerie: string[] = [];
  imagenesRespuesta: string[] = [];
  responseImage: string = '../assets/QS.png'; 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step']) {
      this.cargarImagenes();
  
      const selectedIndex = this.selectedResponses[this.step - 1];
  
      if (selectedIndex !== undefined && selectedIndex !== null && selectedIndex >= 0) {
        this.responseImage = this.imagenesRespuesta[selectedIndex]; 
      } else {
        this.responseImage = '../assets/QS.png'; // Imagen default
      }
    }
  }
  
  cargarImagenes(): void {
    const index = this.step - 1;
    if (index >= 0 && index < conjuntos.conjuntos.length) {
      this.imagenesSerie = conjuntos.conjuntos[index].imagenesSerie;
      this.imagenesRespuesta = conjuntos.conjuntos[index].imagenesRespuesta;
    }
  }

  updateResponseImage(response: string | number): void {
    let responseIndex;
    
    if (typeof response === 'string') {
      responseIndex = this.imagenesRespuesta.indexOf(response);  
    } else {
      responseIndex = response;
    }
    
    const correctAnswerIndex = conjuntos.conjuntos[this.step - 1].correct;
  
    if (responseIndex !== -1) {
      this.responseImage = this.imagenesRespuesta[responseIndex];  
      this.selectedResponses[this.step - 1] = responseIndex; 
  
      
      if (responseIndex === correctAnswerIndex) {
        this.responseStatus[this.step - 1] = 1; // Correcto
      } else {
        this.responseStatus[this.step - 1] = 2; // Incorrecto
      }
    } else {
      this.selectedResponses[this.step - 1] = -1;
      this.responseStatus[this.step - 1] = 0; // nulo
    }
  }
  
}