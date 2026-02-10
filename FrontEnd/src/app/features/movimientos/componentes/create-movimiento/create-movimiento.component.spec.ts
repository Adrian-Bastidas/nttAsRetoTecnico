import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMovimientoComponent } from './create-movimiento.component';

describe('CreateMovimientoComponent', () => {
  let component: CreateMovimientoComponent;
  let fixture: ComponentFixture<CreateMovimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMovimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
