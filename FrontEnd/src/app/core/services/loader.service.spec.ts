import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    service = new LoaderService();
  });

  it('inicialmente debería emitir false', (done) => {
    service.loading$.subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });

  it('debe emitir verdadero cuando se llama a show()', (done) => {
    const emitted: boolean[] = [];

    service.loading$.subscribe((value) => {
      emitted.push(value);
      if (emitted.length === 2) {
        expect(emitted[1]).toBe(true);
        done();
      }
    });

    service.show();
  });

  it('debe emitir falso cuando se llama a hide() después de show()', (done) => {
    const emitted: boolean[] = [];

    service.loading$.subscribe((value) => {
      emitted.push(value);
      if (emitted.length === 3) {
        expect(emitted).toEqual([false, true, false]);
        done();
      }
    });

    service.show();
    service.hide();
  });
});
