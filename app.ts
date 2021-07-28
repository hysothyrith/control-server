import { Server } from "ws";
import { keyboard, Key } from "@nut-tree/nut-js";
import ngrok, { Ngrok } from "ngrok";
import config from "./config";

let authToken: string | undefined = config.authtoken;
let port: number = config.port;
let region = config.region as Ngrok.Region;

keyboard.config.autoDelayMs = 0;

type ArgFlag = "port" | "authtoken" | "region" | undefined;

(function parseArgs() {
  let argFlag: ArgFlag = undefined;

  function isValidFlag(flag: string) {
    return ["port", "authtoken", "region"].includes(flag);
  }

  process.argv.forEach((arg) => {
    const currentFlag = argFlag;
    argFlag = undefined;
    switch (currentFlag) {
      case "port":
        port = parseInt(arg);
        break;
      case "authtoken":
        authToken = arg;
        break;
      case "region":
        region = arg as Ngrok.Region;
        break;
      default:
        if (arg.startsWith("--")) {
          const flag = arg.slice(2);
          if (!isValidFlag(flag)) {
            console.error(`Unknown option: ${arg}`);
            process.exit(1);
          } else {
            argFlag = flag as ArgFlag;
          }
        }
        break;
    }
  });

  if (!authToken) {
    console.log(
      "An ngrok authtoken is required. You can get one at https://ngrok.com/"
    );
    process.exit(0);
  }
})();

(async function start() {
  console.log("Control Server is starting up...\n");

  const wss = new Server({ port });

  wss.on("listening", async () => {
    console.log(`Control Server running locally on port ${port}`);

    const url = await ngrok.connect({
      authtoken: authToken,
      region,
      addr: port,
    });
    const socketUrl = url.replace("https://", "wss://");
    console.log(
      "\x1b[32m%s\x1b[0m",
      `\nControl Server is live at ${socketUrl}\n`
    );
  });

  wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
      console.log(`Received: '${message}'`);
      await control(message.toString());
    });

    ws.send("Connected to Control Server");
  });

  async function control(action: string) {
    switch (action) {
      case "next":
        await keyboard.type(Key.Right);
        break;
      case "prev":
        await keyboard.type(Key.Left);
        break;
      default:
        console.log(`Ignored action of type: '${action}'`);
        break;
    }
  }
})();
