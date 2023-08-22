import {
  ActionArguments,
  ActionFlags,
  DduOptions,
} from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";
import { ActionData } from "../types.ts";
import { isFindActionParams, isGitRepoKindItem } from "../is.ts";

export async function find({
  denops,
  items,
  actionParams,
}: ActionArguments<ActionData>) {
  // Validation
  if (!isFindActionParams(actionParams)) {
    return ActionFlags.None;
  }
  if (items.length !== 1) {
    return ActionFlags.Persist;
  }
  const item = items[0];
  if (!isGitRepoKindItem(item)) {
    console.warn("invalid item kind");
    return ActionFlags.None;
  }
  const { action } = item;

  if (action.path === "") {
    return ActionFlags.None;
  }

  // Find file in repo
  await denops.call(
    "ddu#start",
    {
      // name: options.name,
      push: true,
      sources: [
        {
          name: "file_external",
          params: {
            cmd: [
              "git",
              "-C",
              action.path,
              "ls-files",
              "-co",
              "--exclude-standard",
            ],
          },
          options: {
            path: action.path,
          },
        },
      ],
      ui: actionParams.ui ?? { name: "ff" },
    } satisfies Partial<DduOptions>,
  );

  return ActionFlags.None;
}
