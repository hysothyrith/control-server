import { keyboard, Key } from "@nut-tree/nut-js";

keyboard.config.autoDelayMs = 0;

export default async function control(action: string) {
  switch (action) {
    case "next":
      await keyboard.type(Key.Right);
      break;
    case "prev":
      await keyboard.type(Key.Left);
      break;
    default:
      console.info(`Ignored action of type: '${action}'`);
      break;
  }
}
