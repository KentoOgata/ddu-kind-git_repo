import {
  ActionArguments,
  ActionFlags,
} from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";
import { KindParams } from "../types.ts";
import { isGitRepoKindItem } from "../is.ts";
import { basename } from "https://deno.land/std@0.192.0/path/mod.ts";

export async function startTmux(
  { items }: ActionArguments<KindParams>,
): Promise<ActionFlags> {
  if (items.length !== 1) {
    return ActionFlags.Persist;
  }
  const [item] = items;
  if (!isGitRepoKindItem(item)) {
    console.warn("invalid item kind");
    return ActionFlags.None;
  }
  const { action } = item;
  const sessionName = basename(action.path).replace(/\./, "_");
  await new Deno.Command("tmux", {
    args: [
      "new-session",
      "-d",
      "-s",
      sessionName,
      "-c",
      action.path,
    ],
  }).spawn().status;
  return ActionFlags.None;
}
