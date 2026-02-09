import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConstructorComponent } from './form-constructor.component';

describe('FormConstructorComponent', () => {
  let component: FormConstructorComponent;
  let fixture: ComponentFixture<FormConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
