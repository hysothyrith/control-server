import localtunnel from "localtunnel";

interface LocalTunnelOptions {
  port: number;
  subdomain?: string;
}

async function start(options: LocalTunnelOptions) {
  const { port, subdomain } = options;
  const tunnel = await localtunnel({ port, subdomain });

  const url = tunnel.url.replace("https://", "wss://");
  return url;
}

export default { start };
