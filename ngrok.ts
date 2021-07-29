import ngrok, { Ngrok } from "ngrok";

interface NgrokOptions {
  authToken: string;
  region: Ngrok.Region;
  port: number;
}

async function start(options: NgrokOptions) {
  const { authToken, region, port } = options;
  const httpUrl = await ngrok.connect({
    authtoken: authToken,
    region,
    addr: port,
  });

  const url = httpUrl.replace("https://", "wss://");

  return url;
}

export default { start };
