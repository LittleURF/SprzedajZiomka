import { Injectable, inject } from '@angular/core';
import { Actions, Store, ofActionSuccessful } from '@ngxs/store';
import { GameSelectors } from './game.selectors';
import { NEVER, filter, interval, map, of, switchMap, takeLast, takeUntil, tap, timer } from 'rxjs';
import { GameActions, GameEffectsActions, gameEffectsActions } from './game.actions';
import { getRandomIndex } from '../../../core/utils/array';

export const gamePreparationLengthInMs = 2_000;
export const gameLengthInMs = 15_000;

@Injectable()
export class GameEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  constructor() {
    this.runGameStartCountdown();
    this.runGameProgressCountdown();
    this.requestRandomEffects();
    this.triggerRandomEffects();
  }

  private runGameStartCountdown() {
    this.actions$
      .pipe(
        ofActionSuccessful(GameActions.PrepareGame),
        switchMap(() => timer(gamePreparationLengthInMs)),
        tap(() => this.store.dispatch(GameActions.StartGame)),
      )
      .subscribe();
  }

  private runGameProgressCountdown() {
    this.actions$
      .pipe(
        ofActionSuccessful(GameActions.StartGame),
        switchMap(() =>
          timer(gameLengthInMs).pipe(
            takeUntil(this.actions$.pipe(ofActionSuccessful(GameActions.FinishGame))),
          ),
        ),
        tap(() => this.store.dispatch(GameActions.GameTimerRanOut)),
      )
      .subscribe();
  }

  private requestRandomEffects() {
    this.store
      .select(GameSelectors.IsStatusRunning())
      .pipe(
        switchMap((isRunning) =>
          isRunning
            ? interval(8000).pipe(tap(() => this.store.dispatch(GameActions.TriggerRandomEffect)))
            : NEVER,
        ),
      )
      .subscribe();
  }

  private triggerRandomEffects() {
    this.actions$
      .pipe(
        ofActionSuccessful(GameActions.TriggerRandomEffect),
        map(() => gameEffectsActions[getRandomIndex(gameEffectsActions)]),
        tap((effectAction) => this.store.dispatch(effectAction)),
      )
      .subscribe();
  }
}
