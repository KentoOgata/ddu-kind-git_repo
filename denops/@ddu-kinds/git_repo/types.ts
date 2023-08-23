import { DduItem, UserUi } from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";

export type ActionData = {
  /**
   * Absolute path
   */
  path: string;
};

export type KindParams = Record<string | number | symbol, never>;

export type FindActionParams = {
  ui?: UserUi;
};

export type GitRepoDduItem = DduItem & {
  kind: "git_repo";
  action: ActionData;
};
