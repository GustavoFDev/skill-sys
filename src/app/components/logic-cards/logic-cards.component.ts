import { Component, Input, OnChanges, SimpleChanges,  Output, EventEmitter  } from '@angular/core';
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
  @Output() correctAnswerEmitter = new EventEmitter<boolean>();

  imagenesSerie: string[] = [];
  imagenesRespuesta: string[] = [];
  responseImage: string = '../assets/QS.png'; 

  ngOnChanges(changes: SimpleChanges): void { // Carga las imágenes según el paso actual
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
  
  //Carga las imágenes correspondientes al paso actual desde el json
  cargarImagenes(): void {
    const index = this.step - 1;
    if (index >= 0 && index < conjuntos.conjuntos.length) {
      this.imagenesSerie = conjuntos.conjuntos[index].imagenesSerie; //serie de tres imagenes
      this.imagenesRespuesta = conjuntos.conjuntos[index].imagenesRespuesta; //respuesta
    }
  }

  //Actualiza la imagen seleccionada y verifica si la respuesta es correcta
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
        this.correctAnswerEmitter.emit(true); //Respuesta verdadera para la pregunta 1 (activa un mensaje)
      } else {
        this.responseStatus[this.step - 1] = 2; // Incorrecto
        this.correctAnswerEmitter.emit(false); 
      }
    } else {
      this.selectedResponses[this.step - 1] = -1;
      this.responseStatus[this.step - 1] = 0; // nulo
      this.correctAnswerEmitter.emit(false);
    }
  }

  help(): void {
    let imageIndex = 0; // Comenzamos desde la primera imagen
  
    const imagesToShow = [
      "../assets/IM1.png",
      "../assets/IM2.png",
      "../assets/IM3.png",
      "../assets/IM6.png"
    ]; // Las imágenes que queremos mostrar en secuencia
    const interval = setInterval(() => {
      if (imageIndex < imagesToShow.length) {
        this.responseImage = imagesToShow[imageIndex]; // Actualizamos la imagen
        imageIndex++; // Aumentamos el índice de la imagen
      } else {
        clearInterval(interval); // Detenemos la simulación cuando ya no hay más imágenes
      }
    }, 1000); // Cambiar la imagen cada 1 segundo (1000ms)
  }
  
  
} 