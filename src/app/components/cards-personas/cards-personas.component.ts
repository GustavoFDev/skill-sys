import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import * as FileSaver from 'file-saver';
import { ApplicantService } from '../../core/services/applicant.service';


@Component({
  selector: 'app-cards-personas',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIconModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cards-personas.component.html',
  styleUrls: ['./cards-personas.component.css']
})
export class CardsPersonasComponent {
  @Input() id: string = '';
  @Input() nombre: string = '';
  @Input() apellidos: string = '';
  @Input() email: string = '';
  @Input() currentEmployee: boolean = false;
  @Input() lastUpdate: string = '';

  constructor(private applicantService: ApplicantService) {}

  exportCSV(): void {
    this.applicantService.getApplicantById(this.id).subscribe(
      data => {
        const csvData = this.generateCSVData(data);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, `${this.nombre}_${this.apellidos}.csv`);
      },
      error => {
        console.error('Error fetching applicant data', error);
      }
    );
  }

  generateCSVData(data: any): string {
    const headers = ['Nombre', 'Apellidos', 'Email', 'Calle', 'No.', 'Colonia', 'Ciudad', 'Estado', 'Pais', 'C.P.', 'Celular 1', 'Celular 2', 'Fecha Nacimiento', 'Empleado', 'Alta', ];
    const values = [
      data.name_a,
      `${data.surname_p} ${data.surname_m}`,
      data.email_a,
      data.street,
      data.number,
      data.col,
      data.city,
      data.state,
      data.country,
      data.postal_code,
      data.day_phone,
      data.night_phone,
      data.b_date,
      data.employee ? 'Si' : 'No',
      data.updated_at,
      
    ];

    let csvContent = headers.join(',') + '\n' + values.join(',');
    return csvContent;
  }
}
