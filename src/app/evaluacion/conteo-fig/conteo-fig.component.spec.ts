import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteoFigComponent } from './conteo-fig.component';

describe('ConteoFigComponent', () => {
  let component: ConteoFigComponent;
  let fixture: ComponentFixture<ConteoFigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConteoFigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConteoFigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
