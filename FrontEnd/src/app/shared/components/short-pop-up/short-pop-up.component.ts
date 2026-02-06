import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-short-pop-up',
  imports: [CommonModule],
  templateUrl: './short-pop-up.component.html',
  styleUrl: './short-pop-up.component.css',
})
export class ShortPopUpComponent {
  @Input() show: boolean = false;
  @Input() type: 'success' | 'error' = 'success';
  @Input() message: string = '';
  @Input() showAcceptButton: boolean = true;

  @Output() close = new EventEmitter<void>();

  isClosing = false;
  closePopup() {
    this.close.emit();
  }
  onAnimationEnd() {
    if (this.isClosing) {
      this.show = false;
      this.isClosing = false;
    }
  }
}
