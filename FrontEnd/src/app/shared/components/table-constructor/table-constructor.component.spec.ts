import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableConstructorComponent } from './table-constructor.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ProductoInternalService } from 'src/app/core/services/products.service';

describe('TableConstructorComponent', () => {
  let component: TableConstructorComponent;
  let fixture: ComponentFixture<TableConstructorComponent>;
  let loaderService: LoaderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, TableConstructorComponent],
      providers: [
        { provide: LoaderService, useValue: { loading$: of(true) } },
        { provide: ProductoInternalService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableConstructorComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
    fixture.detectChanges();
  });

  it('debería mostrar la tabla de datos cuando isLoading es false', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });

  it('debería mostrar el mensaje de "No existen registros" cuando data está vacío', () => {
    component.data = [];
    component.isLoading = false;
    fixture.detectChanges();

    const noDataMessage = fixture.debugElement.query(By.css('.no-data-row'));
    expect(noDataMessage).toBeTruthy();
  });

  it('debería cambiar el número de resultados seleccionados cuando se selecciona una opción en el selector', () => {
    const select = fixture.debugElement.query(
      By.css('.result-selector')
    ).nativeElement;
    select.value = '10';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(Number(component.selectedResults)).toBe(10);
  });
});
