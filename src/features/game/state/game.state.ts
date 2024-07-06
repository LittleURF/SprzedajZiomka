import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { GameActions } from './game.actions';
import { updateState } from '../../../core/utils/ngxs';
import { tap, timer } from 'rxjs';
import { DateTime } from 'luxon';
import { WordToWrite } from './game';
import { getRandomWordsToWrite, textToWordsToWrite } from './game,utils';
import { gamePreparationLengthInMs } from './game.effects';

export interface GameStateModel {
  status: 'waiting' | 'starting' | 'running';
  startDateIso: string | null;
  wordsToWrite: WordToWrite[];
  textInput: string;
}

@State<GameStateModel>({
  name: 'game',
  defaults: {
    status: 'waiting',
    startDateIso: null,
    wordsToWrite: [],
    textInput: '',
  },
})
@Injectable()
export class GameState {
  private readonly store = inject(Store);

  @Action(GameActions.PrepareGame)
  prepareGame(ctx: StateContext<GameStateModel>) {
    updateState(ctx, (state) => {
      state.status = 'starting';
      state.startDateIso = DateTime.utc().plus({ milliseconds: gamePreparationLengthInMs }).toISO();
      state.wordsToWrite = getRandomWordsToWrite();
      // // state.wordsToWrite = textToWordsToWrite('Wysyłam Ci gościu.');
      // // state.wordsToWrite = textToWordsToWrite(
      // //   'Wysyłam Ci gościu powiadomienie testowe. Tak, powiadomienie testowe.',
      // // );
      state.wordsToWrite.at(0)!.status = 'InProgress';
    });
  }

  @Action(GameActions.StartGame)
  startGame(ctx: StateContext<GameStateModel>) {
    updateState(ctx, (state) => {
      state.status = 'running';
    });
  }

  @Action([GameActions.FinishGame, GameActions.GameTimerRanOut])
  finishGame(ctx: StateContext<GameStateModel>) {
    updateState(ctx, (state) => {
      state.status = 'waiting';
      state.startDateIso = null;
      state.textInput = '';
    });
  }

  @Action(GameActions.UpdateInputText)
  updateInputText(ctx: StateContext<GameStateModel>, action: GameActions.UpdateInputText) {
    updateState(ctx, (state) => {
      state.textInput = action.text;

      const currentWordToWrite = state.wordsToWrite.find((w) => w.status === 'InProgress');

      if (currentWordToWrite && state.textInput === currentWordToWrite.text) {
        ctx.dispatch(new GameActions.WordWrittenSuccesfully());
      }
    });
  }

  @Action(GameActions.WordWrittenSuccesfully)
  wordWrittenSuccesfully(ctx: StateContext<GameStateModel>) {
    updateState(ctx, (state) => {
      state.textInput = '';
      const currentWordToWriteIndex = state.wordsToWrite.findIndex(
        (w) => w.status === 'InProgress',
      );

      state.wordsToWrite[currentWordToWriteIndex].status = 'Finished';

      const nextWordToWrite = state.wordsToWrite[currentWordToWriteIndex + 1];
      if (nextWordToWrite) {
        nextWordToWrite.status = 'InProgress';
      } else {
        ctx.dispatch(new GameActions.FinishGame(true));
      }
    });
  }
}
