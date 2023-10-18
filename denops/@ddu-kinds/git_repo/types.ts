import { DduItem } from "./deps.ts";

export type ActionData = {
  /**
   * Absolute path
   */
  path: string;
};

export type KindParams = Record<string | number | symbol, never>;

export type GitRepoDduItem = DduItem & {
  kind: "git_repo";
  action: ActionData;
};
