import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteoCardsComponent } from './conteo-cards.component';

describe('ConteoCardsComponent', () => {
  let component: ConteoCardsComponent;
  let fixture: ComponentFixture<ConteoCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConteoCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConteoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
