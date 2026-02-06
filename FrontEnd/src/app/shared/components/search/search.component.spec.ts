import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería emitir el valor de búsqueda después de un debounce', (done) => {
    const searchValue = 'Test';
    component.searchChange.subscribe((emittedValue) => {
      expect(emittedValue).toBe(searchValue);
      done();
    });

    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = searchValue;
    inputElement.triggerEventHandler('ngModelChange', searchValue);
  });

  it('debería tener un valor inicial de searchTerm vacío', () => {
    expect(component.searchTerm).toBe('');
  });

  it('debería actualizar searchTerm cuando el valor del input cambie', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));
    const newValue = 'Nuevo valor';

    inputElement.nativeElement.value = newValue;
    inputElement.triggerEventHandler('ngModelChange', newValue);

    expect(component.searchTerm).toBe(newValue);
  });

  it('debería emitir el valor de búsqueda cuando se llama a onSearch', (done) => {
    const searchValue = 'Test search';
    component.searchChange.subscribe((emittedValue) => {
      expect(emittedValue).toBe(searchValue);
      done();
    });

    component.onSearch(searchValue);
  });

  it('debería tener el valor correcto para placeholder y ariaLabel', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));

    expect(inputElement.nativeElement.getAttribute('placeholder')).toBe(
      'Buscar...'
    );
    expect(inputElement.nativeElement.getAttribute('aria-label')).toBe(
      'Buscar'
    );
  });

  it('debería actualizar el valor de searchTerm a través de ngModel', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));
    const newValue = 'Buscar algo';

    inputElement.nativeElement.value = newValue;
    inputElement.triggerEventHandler('ngModelChange', newValue);

    expect(component.searchTerm).toBe(newValue);
  });
});
