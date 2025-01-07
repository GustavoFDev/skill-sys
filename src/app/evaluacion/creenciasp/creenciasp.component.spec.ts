import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreenciaspComponent } from './creenciasp.component';

describe('CreenciaspComponent', () => {
  let component: CreenciaspComponent;
  let fixture: ComponentFixture<CreenciaspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreenciaspComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreenciaspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
