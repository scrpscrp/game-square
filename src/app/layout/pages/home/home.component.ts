import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameBoardComponent } from '../../../features/game-board/components/game-board.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ShowResultComponent } from '../../../features/game-board/components/show-result/show-result.component';
import { take } from 'rxjs';
import { Result } from '../../../features/game-board/types/result.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GameBoardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @HostListener('document:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isGameStarted) {
      this.startGame();
    }
  }

  public playerScore = signal(0);
  public computerScore = signal(0);
  public timeInMs = 0;
  public isGameStarted = false;
  public readonly initialValue = 0;
  private readonly _dialog = inject(DialogService);

  public startGame(): void {
    if (this.timeInMs < 1) {
      alert('Please setup the timer');
      return;
    } else if (this.timeInMs < 1000) {
      alert('Number should be greater than 1000');
      return;
    }
    this.isGameStarted = true;
    this._reset();
  }

  public onGameOver(result: Result): void {
    const dialog = this._dialog.open(ShowResultComponent, { data: result });
    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe((e: boolean) => {
        this.isGameStarted = !e;
      });
  }

  public playerScored(score: number): void {
    this.playerScore.update(() => score);
  }

  public computerScored(score: number): void {
    this.computerScore.update(() => score);
  }

  private _reset(): void {
    this.playerScore.update(() => this.initialValue);
    this.computerScore.update(() => this.initialValue);
  }
}
