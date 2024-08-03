export namespace GameActions {
  export class PrepareGame {
    static readonly type = '[Game] Prepare';

    constructor() {}
  }

  export class StartGame {
    static readonly type = '[Game] Start';

    constructor() {}
  }

  export class FinishGame {
    static readonly type = '[Game] Finish';

    constructor(public success: boolean) {}
  }

  export class GameTimerRanOut {
    static readonly type = '[Game] Timer ran out';

    constructor() {}
  }

  export class UpdateInputText {
    static readonly type = '[Game] Update input text';

    constructor(public text: string) {}
  }

  export class WordWrittenSuccesfully {
    static readonly type = '[Game] Word written successfuly';

    constructor() {}
  }

  export class TriggerRandomEffect {
    static readonly type = '[Game] Trigger random Effect ';

    constructor() {}
  }
}

export namespace GameEffectsActions {
  // Braciak przychodzi i zasłania cały ekran, idąc na całą wysokość ekranu od lewej do prawej
  export class TriggerBraciakEffect {
    static readonly type = '[Game Effects] Trigger Braciak Effect ';

    constructor() {}
  }

  // Co 2-4 wciśnięcie klawisza nie działa
  export class TriggerAveMatiEffect {
    static readonly type = '[Game Effects] Trigger AveMati Effect ';

    constructor() {}
  }

  // Tekst się trzęsie
  export class TriggerXGamerEffect {
    static readonly type = '[Game Effects] Trigger XGamer Effect ';

    constructor() {}
  }

  // Dwoch polakow w teamie prawda, sam dzwięk.
  export class TriggerDwochPolakowEffect {
    static readonly type = '[Game Effects] Trigger DwochPolakow Effect ';

    constructor() {}
  }

  // Losowe litery są dodawane do inputu co 1-4
  export class TriggerWciskajaMiSiePrzyciskiEffect {
    static readonly type = '[Game Effects] Trigger WciskajaMiSiePrzyciski Effect ';

    constructor() {}
  }

  // Dzwiek kichniecia mammona
  export class TriggerKichEffect {
    static readonly type = '[Game Effects] Trigger Kich Effect ';

    constructor() {}
  }
}

export const gameEffectsActions = [
  GameEffectsActions.TriggerBraciakEffect,
  GameEffectsActions.TriggerAveMatiEffect,
  GameEffectsActions.TriggerXGamerEffect,
  GameEffectsActions.TriggerDwochPolakowEffect,
  GameEffectsActions.TriggerWciskajaMiSiePrzyciskiEffect,
  GameEffectsActions.TriggerKichEffect,
];
