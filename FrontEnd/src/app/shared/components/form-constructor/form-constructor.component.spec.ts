import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  FormConstructorComponent,
  SearchConfig,
} from './form-constructor.component';
import { FormButton, FormField } from 'src/app/core/interfaces/form';

describe('FormConstructorComponent', () => {
  let component: FormConstructorComponent;
  let fixture: ComponentFixture<FormConstructorComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConstructorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormConstructorComponent);
    component = fixture.componentInstance;
    fb = new FormBuilder();
  });

  const createValidForm = (): FormGroup =>
    fb.group({
      name: ['', Validators.required],
      age: [null],
    });

  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      errorMessage: 'Nombre requerido',
    },
    {
      name: 'age',
      label: 'Edad',
      type: 'number',
    },
  ];

  it('should create component', () => {
    component.formGroup = createValidForm();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should throw error if formGroup is not provided', () => {
    expect(() => component.ngOnInit()).toThrow(
      'FormGroup is required for FormConstructorComponent',
    );
  });

  it('should detect search enabled', () => {
    component.formGroup = createValidForm();
    component.searchConfig = {
      enabled: true,
      fieldName: 'search',
      label: 'Buscar',
      placeholder: 'Buscar...',
    };

    fixture.detectChanges();

    expect(component.hasSearchField()).toBe(true);
    expect(component.getSearchLabel()).toBe('Buscar');
    expect(component.getSearchPlaceholder()).toBe('Buscar...');
  });

  it('should emit search event with trimmed value', () => {
    component.formGroup = createValidForm();
    component.searchConfig.enabled = true;
    component.searchTerm = '  prueba  ';

    const spy = jest.spyOn(component.onSearch, 'emit');

    component.handleSearch();

    expect(spy).toHaveBeenCalledWith('prueba');
  });

  it('should not emit search when empty', () => {
    component.formGroup = createValidForm();
    component.searchTerm = '   ';

    const spy = jest.spyOn(component.onSearch, 'emit');

    component.handleSearch();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should map search data fields correctly', () => {
    component.formGroup = createValidForm();
    component.searchConfig = {
      enabled: true,
      fieldName: 'search',
      label: 'Buscar',
      placeholder: 'Buscar...',
      infoFields: [
        { label: 'Nombre', key: 'user.name' },
        { label: 'Email', key: 'user.email' },
      ],
    };

    component.setSearchData({
      user: { name: 'Juan', email: 'juan@test.com' },
    });

    const result = component.getSearchDataFields();

    expect(result).toEqual([
      { label: 'Nombre', value: 'Juan' },
      { label: 'Email', value: 'juan@test.com' },
    ]);
  });

  it('should clear search data', () => {
    component.searchTerm = 'abc';
    component.searchData = { a: 1 };

    component.clearSearchData();

    expect(component.searchData).toBeNull();
    expect(component.searchTerm).toBe('');
  });

  it('should emit submit when form is valid', () => {
    component.formGroup = createValidForm();
    component.formGroup.setValue({ name: 'Juan', age: 20 });

    const spy = jest.spyOn(component.onSubmit, 'emit');

    component.handleSubmit(new Event('submit'));

    expect(spy).toHaveBeenCalled();
  });

  it('should mark all fields touched when form is invalid', () => {
    component.formGroup = createValidForm();

    component.handleSubmit(new Event('submit'));

    expect(component.formGroup.touched).toBe(true);
  });

  it('should execute custom button action', () => {
    const action = jest.fn();
    const button: FormButton = {
      label: 'Custom',
      type: 'button',
      action,
    };

    component.formGroup = createValidForm();

    component.handleButtonClick(button, new Event('click'));

    expect(action).toHaveBeenCalled();
  });

  it('should disable submit button when form is invalid', () => {
    component.formGroup = createValidForm();

    const submitButton: FormButton = {
      label: 'Guardar',
      type: 'submit',
    };

    expect(component.isButtonDisabled(submitButton)).toBe(true);
  });

  it('should emit back event', () => {
    component.formGroup = createValidForm();

    const spy = jest.spyOn(component.onBack, 'emit');

    component.goBack();

    expect(spy).toHaveBeenCalled();
  });

  it('should detect invalid field when touched', () => {
    component.formGroup = createValidForm();

    const control = component.formGroup.get('name') as FormControl;
    control.markAsTouched();

    expect(component.isFieldInvalid('name')).toBe(true);
  });

  it('should return custom error message', () => {
    const field: FormField = {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      errorMessage: 'Error custom',
    };

    expect(component.getErrorMessage(field)).toBe('Error custom');
  });

  it('should return correct grid style', () => {
    component.gridColumns = 3;

    expect(component.getGridStyle()).toEqual({
      'grid-template-columns': 'repeat(3, 1fr)',
    });
  });
});
