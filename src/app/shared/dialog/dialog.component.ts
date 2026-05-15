import { Component, OnInit } from '@angular/core';
import { DialogService, DialogState } from './dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  state: DialogState | null = null;

  constructor(private dialog: DialogService) {}

  ngOnInit(): void {
    this.dialog.state$.subscribe(s => (this.state = s));
  }

  onConfirm(): void {
    this.state?.resolve(true);
  }

  onCancel(): void {
    this.state?.resolve(false);
  }

  onOverlayClick(): void {
    if (this.state && !this.state.isDangerous) {
      this.state.resolve(false);
    }
  }
}
