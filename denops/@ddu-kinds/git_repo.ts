import { Actions, BaseKind } from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";
import { KindParams } from "./git_repo/types.ts";
import { find } from "./git_repo/actions/find.ts";

export class Kind extends BaseKind<KindParams> {
  actions: Actions<KindParams> = {
    find,
  };
  params(): KindParams {
    return {};
  }
}
