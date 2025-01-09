import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPersonasComponent } from './cards-personas.component';

describe('CardsPersonasComponent', () => {
  let component: CardsPersonasComponent;
  let fixture: ComponentFixture<CardsPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPersonasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
