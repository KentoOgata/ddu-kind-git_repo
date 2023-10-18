import { DduItem } from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";
import { ActionData, GitRepoDduItem } from "./types.ts";

export function isGitRepoActionData(x: unknown): x is ActionData {
  return x != null && typeof x === "object" && "path" in x &&
    typeof x.path === "string";
}

export function isGitRepoKindItem(item: DduItem): item is GitRepoDduItem {
  return item.kind === "git_repo" && isGitRepoActionData(item.action);
}
