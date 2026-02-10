import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';

@Component({
  selector: 'app-delete-constructor',
  imports: [CommonModule],
  templateUrl: './delete-constructor.component.html',
  styleUrl: './delete-constructor.component.css',
})
export class DeleteConstructorComponent implements OnInit {
  objAEliminar: any;
  @Output() deleteFunc = new EventEmitter<{ id: String }>();
  @Input() title: String = '';
  @Input() delete: String = '';

  constructor(private generalService: GeneralService) {}
  ngOnInit(): void {
    this.generalService.getObjObservable().subscribe((obj) => {
      this.objAEliminar = obj;
    });
  }
  async onConfirm(): Promise<void> {
    if (this.objAEliminar) {
      this.deleteFunc.emit(this.objAEliminar[this.delete as string]);
    }
  }

  onCancel(): void {
    this.generalService.clearDelObj();
  }
}
