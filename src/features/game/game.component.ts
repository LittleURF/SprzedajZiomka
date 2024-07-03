import { Component, ElementRef, ViewChild, computed, effect, inject } from '@angular/core';
import { Actions, Store, ofActionSuccessful } from '@ngxs/store';
import { GameActions } from './state/game.actions';
import { GameSelectors } from './state/game.selectors';
import { DateTime } from 'luxon';
import { CountdownPipe } from '../../shared/pipes/countdown.pipe';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { WordsToWriteComponent } from './components/words-to-write/words-to-write.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  imports: [
    CountdownPipe,
    CommonModule,
    ReactiveFormsModule,
    WordsToWriteComponent,
    ProgressBarComponent,
  ],
})
export class GameComponent {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  @ViewChild('input')
  protected input!: ElementRef<HTMLInputElement>;

  public readonly startDateIso = this.store.selectSignal(GameSelectors.StartDateIso);
  public readonly gameCountdownEndDateIso = this.store.selectSignal(
    GameSelectors.GameCountdownEndDateIso,
  );
  public readonly status = this.store.selectSignal(GameSelectors.Status);
  public readonly wordsToWrite = this.store.selectSignal(GameSelectors.WordsToWrite);
  public readonly textInput$ = this.store.select(GameSelectors.TextInput);
  public readonly progress = this.store.selectSignal(GameSelectors.Progress());

  public textInput = '';

  constructor() {
    this.textInput$.pipe(tap((textInput) => (this.textInput = textInput))).subscribe();

    this.actions$
      .pipe(
        ofActionSuccessful(GameActions.StartGame),
        tap(() => {
          this.input.nativeElement.disabled = false;
          this.input.nativeElement.focus();
        }),
      )
      .subscribe();
  }

  startGame() {
    this.store.dispatch(new GameActions.PrepareGame());
  }

  textInputChanged(event: Event) {
    if (event.target && 'value' in event.target && 'string' === typeof event.target.value) {
      this.store.dispatch(new GameActions.UpdateInputText(event.target.value));
    }
  }
}
