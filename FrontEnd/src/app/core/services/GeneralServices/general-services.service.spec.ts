import { TestBed } from '@angular/core/testing';
import { GeneralService } from './general-services.service';

describe('GeneralService', () => {
  let service: GeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralService],
    });

    service = TestBed.inject(GeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get objectToEdit', () => {
    const mockObj = { id: 1, name: 'test' };

    service.setObjecttoEdit(mockObj);

    expect(service.getObject()).toEqual(mockObj);
  });

  it('should clear objectToEdit', () => {
    service.setObjecttoEdit({ id: 1 });

    service.clearObject();

    expect(service.getObject()).toBeNull();
  });

  it('should set and get delete object value', () => {
    const mockObj = { id: 10 };

    service.setDelObject(mockObj);

    expect(service.getDelObj()).toEqual(mockObj);
  });

  it('should emit value when setDelObject is called', (done) => {
    const mockObj = { id: 99 };

    service.getObjObservable().subscribe((value) => {
      if (value) {
        expect(value).toEqual(mockObj);
        done();
      }
    });

    service.setDelObject(mockObj);
  });

  it('should clear delete object value', () => {
    service.setDelObject({ id: 5 });

    service.clearDelObj();

    expect(service.getDelObj()).toBeNull();
  });
});
