import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicCardsComponent } from './logic-cards.component';

describe('LogicCardsComponent', () => {
  let component: LogicCardsComponent;
  let fixture: ComponentFixture<LogicCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogicCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
