import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  standalone: true,
  styleUrl: './pruebas.component.css',
  imports: [MatCardModule, MatSliderModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PruebasComponent {
  formatLabel(value: number): string {
    return value + '%';
  }
}
