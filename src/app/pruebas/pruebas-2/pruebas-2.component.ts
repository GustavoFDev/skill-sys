import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropListGroup,
  CdkDropList,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pruebas-2',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './pruebas-2.component.html',
  styleUrls: ['./pruebas-2.component.css'],
})
export class Pruebas2Component {
  numbers: number[] = [1, 2, 3, 4];
  dropzones: number[][] = [[], [], [], []]; // Inicialmente vacíos

  drep(event: CdkDragDrop<number[]>) {
    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    if (prevContainer !== currContainer) {
      if (currContainer.data.length === 0) {
        // Si el cuadro destino está vacío, mueve el número normalmente
        transferArrayItem(prevContainer.data, currContainer.data, event.previousIndex, 0);
      } else {
        // Si el cuadro destino ya tiene un número, intercambia valores
        const prevValue = prevContainer.data[event.previousIndex];
        const currValue = currContainer.data[0]; // Siempre hay un solo valor en el cuadro destino

        prevContainer.data[event.previousIndex] = currValue;
        currContainer.data[0] = prevValue;
      }
    } else {
      moveItemInArray(currContainer.data, event.previousIndex, event.currentIndex);
    }
  }

  assignNextNumber(dropzoneIndex: number) {
    // Busca el siguiente número disponible
    const availableIndex = this.numbers.findIndex(num => !this.dropzones.some(zone => zone.includes(num)));

    if (availableIndex !== -1) {
      const selectedNumber = this.numbers.splice(availableIndex, 1)[0]; // Elimina de numbers y obtiene el número
      this.dropzones[dropzoneIndex].push(selectedNumber); // Lo coloca en el cuadro destino
    }
  }



  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


}
