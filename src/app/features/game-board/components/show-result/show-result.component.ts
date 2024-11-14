import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '../../../../../shared/dialog/dialog.token';
import { DialogRef } from '../../../../../shared/dialog/dialog.ref';
import { Result } from '../../types/result.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-result.component.html',
  styleUrl: './show-result.component.scss'
})
export class ShowResultComponent {
  constructor(
    @Inject(DIALOG_DATA) public result: Result,
    private _dialog: DialogRef
  ) {}

  public closeDialog(): void {
    this._dialog.close(true);
  }
}
