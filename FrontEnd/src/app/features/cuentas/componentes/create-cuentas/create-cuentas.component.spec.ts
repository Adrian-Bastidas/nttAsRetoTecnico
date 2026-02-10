import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCuentasComponent } from './create-cuentas.component';

describe('CreateCuentasComponent', () => {
  let component: CreateCuentasComponent;
  let fixture: ComponentFixture<CreateCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCuentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
