import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import * as FileSaver from 'file-saver';
import { ApplicantService } from '../../core/services/applicant.service';
import { CreenciaspService } from '../../core/services/creenciasp/creenciasp.service';
import { forkJoin } from 'rxjs';

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
        forkJoin({
          creencias1: this.creenciaspService.getCreenciasByApplicantId(this.id),
          creencias2: this.creenciaspService.getCreenciasByApplicantId1(this.id),
          creencias3: this.creenciaspService.getCreenciasByApplicantId2(this.id),
          creencias4: this.creenciaspService.getCreenciasByApplicantId3(this.id),
        }).subscribe(
          ({ creencias1, creencias2, creencias3, creencias4 }) => {
            const csvData = this.generateCSVData(data, creencias1, creencias2, creencias3, creencias4);
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

  generateCSVData(applicantData: any, creencias1: any, creencias2: any, creencias3: any, creencias4: any): string {
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
    
    const creenciasResponses1 = this.formatCreenciasResponses(creencias1, 'Respuestas creencias 1');
    const creenciasResponses2 = this.formatCreenciasResponses(creencias2, 'Respuestas creencias 2');
    const creenciasResponses3 = this.formatCreenciasResponses(creencias3, 'Respuestas creencias 3');
    const creenciasResponses4 = this.formatCreenciasResponses(creencias4, 'Respuestas creencias 4');
    
    const csvContent = [
      headers.join(','), values.join(','),
      creenciasResponses1,
      '\t\t',
      creenciasResponses2,
      '\t\t',
      creenciasResponses3,
      '\t\t',
      creenciasResponses4
    ].join('\n\n');
    
    return csvContent;
  }

  private formatCreenciasResponses(creencias: any, title: string): string {
    if (!creencias.length) {
      return '';
    }
    return `${title}:\n` + Object.entries(creencias[0])
      .map(([key, value]) => `${key},\t${value}`)
      .join('\n');
  }
  
}
