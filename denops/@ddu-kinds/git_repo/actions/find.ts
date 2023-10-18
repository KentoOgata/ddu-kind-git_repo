import { KindParams } from "../types.ts";
import { isGitRepoKindItem } from "../is.ts";
import { ActionArguments, ActionFlags, DduOptions, UserUi } from "../deps.ts";

export type ActionParams = {
  ui?: UserUi;
};

const isFindActionParams = (x: unknown): x is ActionParams => {
  return x != null && typeof x === "object" &&
    (("ui" in x && x.ui != null) || !("ui" in x));
};

export async function find({
  denops,
  items,
  actionParams,
  options,
}: ActionArguments<KindParams>) {
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
  await denops.dispatch(
    "ddu",
    "start",
    {
      name: options.name,
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
