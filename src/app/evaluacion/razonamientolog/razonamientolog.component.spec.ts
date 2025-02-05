import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonamientologComponent } from './razonamientolog.component';

describe('RazonamientologComponent', () => {
  let component: RazonamientologComponent;
  let fixture: ComponentFixture<RazonamientologComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RazonamientologComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RazonamientologComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
