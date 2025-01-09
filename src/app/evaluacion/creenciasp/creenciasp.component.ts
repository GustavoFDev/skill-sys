import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreenciaspDialogComponent } from '../../help-dialog/creenciasp-dialog/creenciasp-dialog.component';
import { PruebasComponent } from '../../pruebas/pruebas/pruebas.component';

@Component({
  selector: 'app-creenciasp',
  standalone: true,
  imports: [CommonModule, PruebasComponent, MatButtonModule, MatIconModule],
  templateUrl: './creenciasp.component.html',
  styleUrls: ['./creenciasp.component.css']
})
export class CreenciaspComponent implements OnInit {
  step: number = 1;
  countdown: number = 120; // 2 minutos en segundos
  countdownSubscription: Subscription = new Subscription(); // Inicialización en el constructor
  showTimer: boolean = true; // Control de visibilidad del temporizador

  constructor(public dialog: MatDialog) { }

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
    this.dialog.open(CreenciaspDialogComponent);
  }

  pruebas(): void {
    this.dialog.open(PruebasComponent);
  }
  
  nextStep(): void {
    if (this.step < 3) {
      this.step++;
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  finish() {
    console.log('Proceso finalizado');
    this.step = 4; // Cambia al paso "Finalizado"
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}

