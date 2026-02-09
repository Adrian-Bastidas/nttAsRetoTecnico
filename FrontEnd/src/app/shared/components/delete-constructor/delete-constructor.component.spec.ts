import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConstructorComponent } from './delete-constructor.component';

describe('DeleteConstructorComponent', () => {
  let component: DeleteConstructorComponent;
  let fixture: ComponentFixture<DeleteConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
