import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolucionProblemasComponent } from './resolucion-problemas.component';

describe('ResolucionProblemasComponent', () => {
  let component: ResolucionProblemasComponent;
  let fixture: ComponentFixture<ResolucionProblemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolucionProblemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolucionProblemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
