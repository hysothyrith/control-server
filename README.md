# Control Server

Real-time presentation control over WebSocket.

## Getting started

#### 1. Clone Control Server

```shell
git clone https://github.com/hysothyrith/control-server
cd control-server
cp .env.example .env
npm i
```

#### 2. Config Control Server

Sign up for an [ngrok](https://ngrok.com/) account. Then copy your Authtoken from the ngrok dashboard into `.env`

#### 3. Control

```shell
npm run start
```

Visit [control.sothyrith.com](https://control.sothyrith.com) and connect using the given WebSocket URL.
