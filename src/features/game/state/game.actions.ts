export namespace GameActions {
  export class PrepareGame {
    static readonly type = '[Game] Prepare';

    constructor() {}
  }

  export class StartGame {
    static readonly type = '[Game] Start';

    constructor() {}
  }

  export class UpdateInputText {
    static readonly type = '[Game] Update input text';

    constructor(public text: string) {}
  }
}
