import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-required-modal',
  imports: [CommonModule],
  templateUrl: './login-required-modal.component.html',
  styleUrls: ['./login-required-modal.component.css'],
})
export class LoginRequiredModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  loginNow(): void {
    this.login.emit();
  }
}
