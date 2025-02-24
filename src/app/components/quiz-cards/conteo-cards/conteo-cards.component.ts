import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conteo-cards',
  imports: [CommonModule],
  templateUrl: './conteo-cards.component.html',
  styleUrls: ['./conteo-cards.component.css']
})
export class ConteoCardsComponent implements OnInit {
  figures: string[] = [];
  currentIndex: number = 0;
  intervalId: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('assets/figures.json').subscribe((data: any) => {
      this.figures = data[0].figure;
      this.startCarousel();
    });
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.figures.length;
    }, 10000);
  }

  getTransform() {
    const singleImageWidth = 100;
    const translateX = -(this.currentIndex * singleImageWidth);
    return `translateX(${translateX}%)`;
  }
}
