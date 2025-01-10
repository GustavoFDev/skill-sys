import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-cards-personas',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIconModule, MatDividerModule], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cards-personas.component.html',
  styleUrls: ['./cards-personas.component.css']
})
export class CardsPersonasComponent {
  @Input() nombre: string = '';
  @Input() apellidos: string = '';
  @Input() email: string = '';
  @Input() currentEmployee: boolean = false; 
  @Input() lastUpdate: string = ''; 
}
