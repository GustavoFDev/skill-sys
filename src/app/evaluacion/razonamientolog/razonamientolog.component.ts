import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LogicCardsComponent } from '../../components/logic-cards/logic-cards.component';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
import { LogicDialogComponent } from '../../help-dialog/logic-dialog/logic-dialog.component';
import { ApplicantService } from '../../core/services/applicant.service';
import { RazonamientologService } from '../../core/services/razonamientolog.service';
      
@Component({
  selector: 'app-razonamientolog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, LogicCardsComponent, MatIconModule],
  templateUrl: './razonamientolog.component.html',
  styleUrls: ['./razonamientolog.component.css'],
})
export class RazonamientologComponent {
  step = 1;
  selectedResponses: number[] = []; 
  responseStatus: number[] = [];   
  responses: { [key: string]: string | number } = {};
  countdown: number = 300; // Tiempo en segundos (5 minutos)
  countdownSubscription: Subscription = new Subscription();
  showTimer: boolean = true;

  constructor(public dialog: MatDialog, private razonamientologService: RazonamientologService,  private applicantService: ApplicantService, private router: Router){}

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.countdownSubscription = interval(1000).pipe(
      take(this.countdown)
    ).subscribe(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.finish();
      }
    });
  }

  get minutes(): number {
    return Math.floor(this.countdown / 60);
  }
  
  get seconds(): number {
    return this.countdown % 60;
  }
  
  toggleTimer(): void {
    this.showTimer = !this.showTimer;
  }

  openHelpDialog(): void {
    this.dialog.open(LogicDialogComponent);
  }

  nextStep(): void {
    if (this.step < 16) {
      this.step++;
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        this.finish();
      }
    });
  }

  finish(): void {

    for (let i = 1; i < 16; i++) {
      this.responses[`mrl_${i}`] = this.responseStatus[i] || 0;
    }

    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
    this.responses['current_step'] = this.step;

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId; 
    }

    this.razonamientologService.sendFormData(this.responses).subscribe(
      {
        next : (response) => {
          console.log('Datos enviados correctamente:', response);
          this.router.navigate(['/creencias_personales3']);
        },
        error : (error) => {
          console.error('Error al enviar los datos:', error);
        }
      }
    );
  }

}
