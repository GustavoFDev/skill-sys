import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonamientonumComponent } from './razonamientonum.component';

describe('RazonamientonumComponent', () => {
  let component: RazonamientonumComponent;
  let fixture: ComponentFixture<RazonamientonumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RazonamientonumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RazonamientonumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
