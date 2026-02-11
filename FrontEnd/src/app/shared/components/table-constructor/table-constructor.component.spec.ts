import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableConstructorComponent } from './table-constructor.component';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('TableConstructorComponent', () => {
  let component: TableConstructorComponent;
  let fixture: ComponentFixture<TableConstructorComponent>;
  let router: Router;
  let generalService: GeneralService;
  let loaderService: LoaderService;

  const loadingSubject = new BehaviorSubject<boolean>(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, TableConstructorComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: GeneralService,
          useValue: {
            setObjecttoEdit: jest.fn(),
          },
        },
        {
          provide: LoaderService,
          useValue: {
            loading$: loadingSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableConstructorComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    generalService = TestBed.inject(GeneralService);
    loaderService = TestBed.inject(LoaderService);

    component.columns = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'email', label: 'Email' },
    ];

    component.data = [
      { id: '1', nombre: 'Juan Gomez', email: 'juan@test.com' },
    ];

    component.currentPage = 1;
    component.maxPage = 3;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // =========================
  // Loader
  // =========================
  it('should update isLoading from LoaderService', () => {
    loadingSubject.next(true);
    expect(component.isLoading).toBe(true);

    loadingSubject.next(false);
    expect(component.isLoading).toBe(false);
  });

  // =========================
  // Utils
  // =========================
  it('should return nested property value', () => {
    const obj = { user: { name: 'Juan' } };
    const result = component.getNestedProperty(obj, 'user.name');
    expect(result).toBe('Juan');
  });

  it('should return initials correctly', () => {
    expect(component.getInitials('Juan Gomez')).toBe('JG');
    expect(component.getInitials('')).toBe('JG');
  });

  // =========================
  // Menu
  // =========================
  it('should toggle menu index', () => {
    component.toggleMenu(1);
    expect(component.openMenuIndex).toBe(1);

    component.toggleMenu(1);
    expect(component.openMenuIndex).toBeNull();
  });

  it('should close menu on document click outside', () => {
    component.openMenuIndex = 1;

    const div = document.createElement('div');

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: div,
    });

    component.onDocumentClick(event);

    expect(component.openMenuIndex).toBeNull();
  });

  // =========================
  // Image
  // =========================
  it('should mark image as failed', () => {
    component.onImageError('123');
    expect(component.imagenFallida['123']).toBe(true);
  });

  // =========================
  // Actions
  // =========================
  it('should navigate to edit route and set object', () => {
    const row = { id: 1 };
    component.editRoute = '/edit';

    component.editItem(row);

    expect(generalService.setObjecttoEdit).toHaveBeenCalledWith(row);
    expect(router.navigate).toHaveBeenCalledWith(['/edit']);
  });

  it('should call delete function', () => {
    const row = { id: 1 };
    const deleteFn = jest.fn();
    component.deleteFunction = deleteFn;

    component.deleteItem(row);

    expect(deleteFn).toHaveBeenCalledWith(row);
  });

  // =========================
  // Pagination
  // =========================
  it('should go to next page', () => {
    const spy = jest.spyOn(component.pageChange, 'emit');

    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should not exceed max page', () => {
    component.currentPage = 3;
    component.nextPage();

    expect(component.currentPage).toBe(3);
  });

  it('should go to previous page when currentPage > 1', () => {
    const spy = jest.spyOn(component.pageChange, 'emit');

    component.currentPage = 2;

    component.prevPage();

    expect(component.currentPage).toBe(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  // =========================
  // Page size
  // =========================
  it('should emit page size change', () => {
    const spy = jest.spyOn(component.pageSizeChange, 'emit');

    component.selectedResults = 10;
    component.onPageSizeChange();

    expect(spy).toHaveBeenCalledWith({
      size: 10,
      page: component.currentPage,
    });
  });
});
