# Control Server

Real-time presentation control over WebSocket.

## Getting started

### 1. Clone Control Server

```shell
git clone https://github.com/hysothyrith/control-server
cd control-server
npm i
```

### 2. Config Control Server

```shell
cp .env.example .env
```

You have two options for tunneling into the local WebSocket server:

- localtunnel: no sign-up needed, allows setting a custom subdomain, but doesn’t support setting a region
- ngrok: requires signing up for a free account, but allows choosing a limited selection of regions for better response time

Control Server is configured to use localtunnel by default.

#### Using with ngrok

Sign up for an [ngrok](https://ngrok.com/) account. Then copy your Authtoken from the ngrok dashboard into `.env`. Set the `TUNNEL` in `.env` to ngrok.

### 3. Control

```shell
npm run start
```

Visit [control.sothyrith.com](https://control.sothyrith.com) and connect using the given WebSocket URL.
