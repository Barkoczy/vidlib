# VidLib
Video library for videos of an account with usage peertube-api.

## Getting Started

First, create .env file and fill empty fields. If needed edit default setup values:

```bash
SERVER_PORT=4848

APP_NAME=VidLib
APP_LANG=sk

JWT_EXPIRE=1h
JWT_SECRET=

COOKIE_MAXAGE=3600000
COOKIE_SECRET=

PEERTUBE_DOMAIN=
PEERTUBE_USERNAME=
PEERTUBE_PASSWORD=
PEERTUBE_FEED_LIMIT=15
```

Create credentials.json file in root app dir:

```bash
{
  "token": "",
  "expires_in": 0
}
```

Run the development server:

```bash
npm run dev
```
