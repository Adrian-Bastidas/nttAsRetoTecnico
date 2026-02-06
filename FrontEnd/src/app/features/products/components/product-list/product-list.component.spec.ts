import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from 'src/app/core/services/products.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

@Component({ selector: 'app-table-constructor', template: '' })
class MockTableConstructorComponent {
  @Input() columns: any;
  @Input() data: any;
  @Input() deleteFunction: any;
}

@Component({ selector: 'app-search', template: '' })
class MockSearchComponent {
  @Output() searchChange = new EventEmitter<string>();
}

describe('ProductListComponent (Jest)', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: any;
  let loaderServiceMock: any;
  let routerMock: any;

  const mockProducts = [
    {
      name: 'Producto 1',
      description: 'Desc 1',
      date_release: '2024-01-01',
      date_revision: '2024-01-10',
      logo: '',
    },
    {
      name: 'Producto 2',
      description: 'Desc 2',
      date_release: '2024-02-01',
      date_revision: '2024-02-10',
      logo: '',
    },
  ];

  beforeEach(async () => {
    productServiceMock = {
      loadProducts: jest.fn().mockResolvedValue(mockProducts),
    };

    loaderServiceMock = {
      show: jest.fn(),
      hide: jest.fn(),
      loading$: of(false),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        MockTableConstructorComponent,
        CommonModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: LoaderService, useValue: loaderServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('debería cargar productos en ngOnInit', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(productServiceMock.loadProducts).toHaveBeenCalled();
    expect(component.rows.length).toBe(2);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });

  it('debería navegar a /add al hacer clic en "Agregar"', () => {
    component.goToAddProduct();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/add']);
  });
});
