import { GitRepoDduItem, KindParams } from "../types.ts";
import { isGitRepoKindItem } from "../is.ts";
import { ActionArguments, ActionFlags, Denops, is } from "../deps.ts";

type VimCommand = {
  type: "cmd";
  /**
   * Expected to contains 1 or less %s.
   * It will be replaced by git repository path on execute.
   */
  command: string;
};

type VimFunction = {
  type: "fn";
  /**
   * denops callback id.
   * You can get this by denops#callback#register({funcref}).
   * Function signature is expected to f(path: string).
   */
  callbackId: string;
};

type GitLogCmd =
  | ((denops: Denops, item: GitRepoDduItem) => Promise<void>)
  | VimCommand
  | VimFunction;

export type ActionParams = {
  cmd?: GitLogCmd;
};

const isGitLogCmd = (x: unknown): x is GitLogCmd => {
  return is.AsyncFunction(x) || is.ObjectOf({ type: is.String })(x);
};

const isLogActionParams: (x: unknown) => x is ActionParams = is.ObjectOf({
  cmd: is.OptionalOf(isGitLogCmd),
});

const runCmd = async (denops: Denops, cmd: GitLogCmd, item: GitRepoDduItem) => {
  if (is.AsyncFunction(cmd)) {
    await cmd(denops, item);
  } else if (is.ObjectOf({ type: is.String })(cmd)) {
    if (cmd.type === "cmd") {
      await denops.cmd(`exec '${item.action.path}'->printf('${cmd.command}')`);
    } else {
      await denops.batch([
        "denops#callback#call",
        [cmd.callbackId, item.action.path],
      ]);
    }
  }
};

const defaults = {
  cmd: {
    type: "cmd",
    command: "GinLog ++worktree=%s",
  },
} as const satisfies ActionParams;

export async function log({
  denops,
  items,
  actionParams,
}: ActionArguments<KindParams>): Promise<ActionFlags> {
  if (!isLogActionParams(actionParams)) {
    return ActionFlags.None;
  }

  for (const item of items) {
    if (!isGitRepoKindItem(item)) {
      continue;
    }
    const cmd = actionParams.cmd ?? defaults.cmd;
    await runCmd(denops, cmd, item);
  }

  return ActionFlags.None;
}
