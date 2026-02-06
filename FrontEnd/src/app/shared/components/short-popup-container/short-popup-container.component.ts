import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ShortPopUpComponent } from '../short-pop-up/short-pop-up.component';
import { ShortPopUpService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-short-popup-container',
  imports: [CommonModule, ShortPopUpComponent],
  templateUrl: './short-popup-container.component.html',
  styleUrl: './short-popup-container.component.css',
})
export class ShortPopupContainerComponent {
  popupService = inject(ShortPopUpService);

  handleClose(): void {
    this.popupService.hide();
  }
}
