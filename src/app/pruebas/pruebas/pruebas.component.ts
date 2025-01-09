import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';


@Component({
  selector: 'app-pruebas',
  imports: [MatSliderModule, MatCardModule, MatButtonModule, MatSlideToggleModule, MatIconModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.css'
})

export class PruebasComponent {

  formatLabel(value: number): string {
    return `${value}`;
  }

}
