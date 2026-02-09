import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private objectToEdit: any = null;
  private objSubject = new BehaviorSubject<any>(null);
  setObjecttoEdit(obj: any): void {
    this.objectToEdit = obj;
  }

  getObject(): any {
    return this.objectToEdit;
  }

  clearObject(): void {
    this.objectToEdit = null;
  }

  setDelObject(obj: any): void {
    this.objSubject.next(obj);
  }

  getDelObj(): any {
    return this.objSubject.value;
  }

  getObjObservable() {
    return this.objSubject.asObservable();
  }

  clearDelObj(): void {
    this.objSubject.next(null);
  }
}
