import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreenciaspDialogComponent } from '../../help-dialog/creenciasp-dialog/creenciasp-dialog.component';
import { QuizCardsComponent } from '../../components/quiz-cards/quiz-cards.component'; 

@Component({
  selector: 'app-creenciasp',
  standalone: true,
  imports: [CommonModule, QuizCardsComponent, MatButtonModule, MatIconModule], 
  templateUrl: './creenciasp.component.html',
  styleUrls: ['./creenciasp.component.css']
})
export class CreenciaspComponent implements OnInit {
  step: number = 1;
  countdown: number = 120; 
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; 

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
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
    this.dialog.open(CreenciaspDialogComponent);
  }

  quizCards(): void {
    this.dialog.open(QuizCardsComponent);
  }
  
  nextStep(): void {
    if (this.step < 17) { 
      this.step++;
      if (this.step === 2) {
        this.startCountdown();
      }
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  finish() {
    console.log('Proceso finalizado');
    this.step = 18; 
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
