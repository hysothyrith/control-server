import { Server } from "ws";
import config from "./config";
import control from "./control";
import localtunnel from "./localtunnel";
import ngrok from "./ngrok";
import { Ngrok } from "ngrok";

let port: number = config.port;
let tunnel = config.tunnel;

/* localtunnel */
let subdomain = config.subdomain;

/* ngrok */
let authToken: string | undefined = config.authtoken;
let region = config.region as Ngrok.Region;

(function parseArgs() {
  type ArgFlag =
    | "port"
    | "authtoken"
    | "region"
    | "tunnel"
    | "subdomain"
    | undefined;

  let argFlag: ArgFlag = undefined;

  function isValidFlag(flag: string) {
    const validFlags = ["port", "authtoken", "region", "tunnel", "subdomain"];
    return validFlags.includes(flag);
  }

  process.argv.forEach((arg) => {
    const currentFlag = argFlag;
    argFlag = undefined;
    switch (currentFlag) {
      case "port":
        port = parseInt(arg);
        break;
      case "tunnel":
        if (arg !== "localtunnel" && arg !== "ngrok") {
          console.error(`Invalid tunnel: ${arg}`);
          process.exit(1);
        }
        tunnel = arg;
        break;
      case "subdomain":
        subdomain = arg;
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
})();

async function startTunnel() {
  switch (tunnel) {
    case "localtunnel":
      return await localtunnel.start({ port, subdomain });
    case "ngrok":
      if (!authToken) {
        console.error(
          "An ngrok authtoken is required to use the ngrok tunnel. You can get one at https://ngrok.com/"
        );
        process.exit(1);
      }
      return await ngrok.start({ port, authToken, region });
    default:
      console.error(`Tunnel of type ${tunnel} is not available`);
      process.exit(1);
      break;
  }
}

(async function start() {
  console.info("Control Server is starting up...\n");

  function noop() {}

  function heartbeat(this: any) {
    this.isAlive = true;
  }

  const wss = new Server({ port });

  wss.on("listening", async () => {
    console.info(`Control Server running locally on port ${port}`);

    const url = await startTunnel();
    console.info("\x1b[32m%s\x1b[0m", `\nControl Server is live at ${url}\n`);
  });

  wss.on("connection", (ws) => {
    ws.send("Connected to Control Server");

    ws.on("message", async (message) => {
      console.info(`Received: '${message}'`);
      await control(message.toString());
    });

    ws.on("pong", heartbeat);
  });

  const pingInterval = setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30_000);

  wss.on("close", () => {
    clearInterval(pingInterval);
  });

  process.on("SIGINT", () => {
    wss.close();
    process.exit();
  });
})();
