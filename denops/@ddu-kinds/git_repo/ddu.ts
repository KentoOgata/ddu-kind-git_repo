import { au, DduContext, Denops, uuid } from "./deps.ts";

const vimIf = (cond: string, cmd: string[]) => {
  return [`if ${cond}`, ...cmd, "endif"].join(" | ");
};

export const deferToDduLeave = async (
  denops: Denops,
  context: DduContext,
  callback: () => Promise<void>,
) => {
  const id = uuid.v1.generate();
  const endpoint = `callback:${id}`;
  const groupName = `ddu-callback-${id}`;

  denops.dispatcher = {
    ...denops.dispatcher,
    [endpoint]: async () => {
      delete denops.dispatcher[endpoint];
      await au.group(denops, groupName, (helper) => {
        helper.remove();
      });
      await callback();
    },
  };

  await au.group(denops, groupName, (helper) => {
    helper.define(
      "WinEnter",
      "*",
      vimIf(
        `win_getid() ==# ${context.winId}`,
        [`call denops#notify('${denops.name}', '${endpoint}', [])`],
      ),
    );
  });
};
