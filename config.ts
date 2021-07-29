require("dotenv").config();

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 80,
  subdomain: process.env.SUBDOMAIN,
  authtoken: process.env.AUTH_TOKEN,
  region: process.env.REGION ?? "ap",
  tunnel: process.env.TUNNEL ?? "localtunnel",
};

export default config;
