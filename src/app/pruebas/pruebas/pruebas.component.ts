import { Component } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-pruebas',
  imports: [MatSliderModule],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.css'
})
export class PruebasComponent {

  formatLabel(value: number): string {
    return `${value}`;
  }

}
