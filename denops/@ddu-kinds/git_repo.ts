import { Actions, BaseKind } from "./git_repo/deps.ts";
import { KindParams } from "./git_repo/types.ts";
import { find } from "./git_repo/actions/find.ts";
import { startTmux } from "./git_repo/actions/startTmux.ts";
import { log } from "./git_repo/actions/log.ts";

export class Kind extends BaseKind<KindParams> {
  actions: Actions<KindParams> = {
    find,
    startTmux,
    log,
  };
  params(): KindParams {
    return {};
  }
}
