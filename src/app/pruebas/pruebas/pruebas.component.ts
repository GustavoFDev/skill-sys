
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
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
