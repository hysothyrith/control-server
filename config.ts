require("dotenv").config();

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 80,
  authtoken: process.env.AUTH_TOKEN,
  region: process.env.REGION ?? "ap",
};

export default config;
