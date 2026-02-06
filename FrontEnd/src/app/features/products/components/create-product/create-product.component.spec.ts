import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ProductoInternalService,
  ProductService,
} from 'src/app/core/services/products.service';
import { of } from 'rxjs';
import { ShortPopUpComponent } from 'src/app/shared/components/short-pop-up/short-pop-up.component';

const mockRouter = {
  navigate: jest.fn(),
};

const mockProductoInternalService = {
  getProducto: jest.fn(),
  clearProducto: jest.fn(),
};

const mockProductService = {
  validateId: jest.fn(),
  createProducts: jest.fn(),
  editProduct: jest.fn(),
};

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CreateProductComponent,
        ShortPopUpComponent,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ProductoInternalService,
          useValue: mockProductoInternalService,
        },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    const form = component.formulario;
    expect(form).toBeDefined();
    expect(form.controls['id']).toBeDefined();
    expect(form.controls['name']).toBeDefined();
    expect(form.controls['description']).toBeDefined();
    expect(form.controls['logo']).toBeDefined();
    expect(form.controls['date_release']).toBeDefined();
    expect(form.controls['date_revision'].disabled).toBe(true);
  });

  it('debería mostrar popup si el ID ya existe', fakeAsync(async () => {
    component.formulario.patchValue({
      id: 'ABC123',
      name: 'Producto Test',
      description: 'Descripción de prueba',
      logo: 'logo.png',
      date_release: '2025-04-14',
    });

    mockProductService.validateId.mockReturnValue(Promise.resolve(true));

    await component.enviar();

    fixture.detectChanges();

    expect(component.mostrarPopup).toBe(true);
    expect(component.message).toBe('El ID ya existe, por favor ingrese otro');
  }));

  it('debería actualizar date_revision al cambiar date_release', fakeAsync(() => {
    component.formulario.get('date_release')?.setValue('2025-04-14');
    tick();

    const revision = component.formulario.get('date_revision')?.value;
    expect(revision).toBe('2026-04-14');
  }));

  it('debería mostrar popup si el ID ya existe', fakeAsync(async () => {
    component.formulario.patchValue({
      id: 'ABC123',
      name: 'Producto Test',
      description: 'Descripción de prueba',
      logo: 'logo.png',
      date_release: '2025-04-14',
    });

    mockProductService.validateId.mockResolvedValue(true);

    await component.enviar();

    expect(component.mostrarPopup).toBe(true);

    expect(component.message).toBe('El ID ya existe, por favor ingrese otro');
  }));

  it('debería llamar a createProducts si el ID no existe', fakeAsync(async () => {
    component.formulario.patchValue({
      id: 'ID001',
      name: 'Nuevo Producto',
      description: 'Descripción válida',
      logo: 'logo.png',
      date_release: '2025-04-14',
    });

    mockProductService.validateId.mockResolvedValue(false);
    mockProductService.createProducts.mockResolvedValue(true);

    await component.enviar();
    fixture.detectChanges();

    expect(mockProductService.createProducts).toHaveBeenCalled();
  }));

  it('debería resetear el formulario al llamar a reiniciar()', () => {
    component.formulario.patchValue({
      name: 'Algo',
      date_release: '2025-04-14',
    });

    component.reiniciar();

    expect(component.formulario.get('name')?.value).toBe('');
    expect(component.formulario.get('date_release')?.value).toBe('');
    expect(component.formulario.get('date_revision')?.value).toBe('');
  });
});
