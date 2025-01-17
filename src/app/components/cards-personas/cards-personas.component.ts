import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import * as FileSaver from 'file-saver';
import { ApplicantService } from '../../core/services/applicant.service';
import { CreenciaspService } from '../../core/services/creenciasp/creenciasp.service';

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

  constructor(private applicantService: ApplicantService, private creenciaspService: CreenciaspService) {}

  exportCSV(): void {
    this.applicantService.getApplicantById(this.id).subscribe(
      data => {
        this.creenciaspService.getCreenciasByApplicantId(this.id).subscribe(
          creencias => {
            const csvData = this.generateCSVData(data, creencias);
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            FileSaver.saveAs(blob, `${this.nombre}_${this.apellidos}.csv`);
          },
          error => {
            console.error('Error fetching creencias data', error);
          }
        );
      },
      error => {
        console.error('Error fetching applicant data', error);
      }
    );
  }

  generateCSVData(applicantData: any, creenciasData: any): string {
    const headers = [
      'Nombre', 'Apellidos', 'Fecha Nacimiento', 'Genero', 'Calle', 'No.', 'Colonia', 'Ciudad', 
      'Estado', 'Pais', 'C.P.', 'Celular 1', 'Celular 2', 'Correo', 
      'RFC', 'Empleado', 'Alta'
    ];
    
    const values = [
      applicantData.name_a,
      `${applicantData.surname_p} ${applicantData.surname_m}`,
      applicantData.b_date,
      applicantData.gender,
      applicantData.street,
      applicantData.number,
      applicantData.col,
      applicantData.city,
      applicantData.state,
      applicantData.country,
      applicantData.postal_code,
      applicantData.day_phone,
      applicantData.night_phone,
      applicantData.email_a,
      applicantData.rfc,
      applicantData.employee ? 'Si' : 'No',
      applicantData.updated_at,
    ];
    
    // Formato de las respuestas de creencias
    const creenciasResponses = creenciasData.map((creencia: any) => {
      const { applicant_id, ...responses } = creencia;
      return `Respuestas creencias 1:\n` + 
        Object.entries(responses)
        .map(([key, value]) => `${key},\t${value}`).join('\n');
    }).join('\n\n');
    
    const csvContent = headers.join(',') + '\n' + values.join(',') + '\n\n' + creenciasResponses;
    return csvContent;
  }
}



