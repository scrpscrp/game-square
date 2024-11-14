import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  input,
  Output
} from '@angular/core';
import { Result } from '../types/result.interface';
import { Square } from '../types/square.interface';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  @Input({ required: true })
  public initialValue: number = 0;

  @Output()
  public gameOver = new EventEmitter<Result>();

  @Output()
  public playerScored = new EventEmitter<number>();

  @Output()
  public computerScored = new EventEmitter<number>();

  public timeInMs = input.required<number>();
  public isGameStarted = input.required<boolean>();
  public squares: Square[] = Array(100).fill({
    highlighted: false,
    incorrect: false,
    correct: false
  });
  public currentIndex = -1;
  public playerScore = this.initialValue;
  public computerScore = this.initialValue;
  private _highlightedIndexes: number[] = [];

  constructor() {
    effect(() => {
      if (this.isGameStarted()) {
        this.startGame();
      }
    });
  }

  public startGame(): void {
    this.highlightRandomSquare();
  }

  public highlightRandomSquare(): void {
    const randomIndex = Math.floor(Math.random() * 100);

    if (!this._highlightedIndexes.includes(randomIndex)) {
      this._highlightedIndexes.push(randomIndex);

      this.currentIndex = randomIndex;

      this.squares[randomIndex] = {
        ...this.squares[randomIndex],
        highlighted: true
      };

      setTimeout(() => {
        this.squares[randomIndex] = {
          ...this.squares[randomIndex],
          highlighted: false
        };

        if (!this.squares[randomIndex].correct) {
          this.squares[randomIndex] = {
            ...this.squares[randomIndex],
            incorrect: true
          };
          this.computerScore++;
          this.computerScored.emit(this.computerScore);
        }

        if (this.playerScore === 10 || this.computerScore === 10) {
          this._endGame();
        } else {
          this.highlightRandomSquare();
        }
      }, this.timeInMs());
      return;
    }

    this.highlightRandomSquare();
  }

  public onSquareClick(index: number): void {
    if (this.squares[index].highlighted) {
      this.squares[index] = { ...this.squares[index], correct: true };

      this.playerScore++;

      this.playerScored.emit(this.playerScore);
    }
  }

  private _endGame(): void {
    const result = {
      playerScore: this.playerScore,
      computerScore: this.computerScore
    };
    if (this.playerScore > this.computerScore) {
      this.gameOver.emit({ ...result, text: 'Гравець виграв!' });
    } else if (this.playerScore < this.computerScore) {
      this.gameOver.emit({ ...result, text: "Комп'ютер виграв!" });
    } else {
      this.gameOver.emit({ ...result, text: 'Нічия!' });
    }

    this._reset();
  }

  private _reset(): void {
    this.squares = Array(100).fill({
      highlighted: false,
      incorrect: false,
      correct: false
    });
    this.computerScore = this.initialValue;
    this.playerScore = this.initialValue;
    this._highlightedIndexes = [];

    this.playerScored.emit(this.initialValue);
    this.computerScored.emit(this.initialValue);
  }
}
