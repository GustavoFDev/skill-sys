import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-pruebas-2',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './pruebas-2.component.html',
  styleUrl: './pruebas-2.component.css'
})
export class Pruebas2Component {

}
