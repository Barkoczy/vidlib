# VidLib
Video library for videos of an account with usage peertube-api.

## Setup

Create .env file and fill empty fields. If needed edit default setup values.

### Setup options

#### Authorization mode

* Strict
* Credentials
* Peertube
* Mixed

#### Strict

Edit option value in .env file:

```bash
AUTH_MODE=strict
```

##### Credentials

Edit option value in .env file:

```bash
AUTH_MODE=credentials
```

##### Peertube

Edit option value in .env file:

```bash
AUTH_MODE=peertube
```

##### Mixed

Edit option value in .env file:

```bash
AUTH_MODE=mixed
```

#### Player mode

* Embed
* JS Player
* WebTorrent

##### Embed

Edit option value in .env file:

```bash
PLAYER_MODE=embed
```

##### JS Player

Edit option value in .env file:

```bash
PLAYER_MODE=jsplayer
```

##### WebTorrent

Edit option value in .env file:

```bash
PLAYER_MODE=webtorrent
```

## Quick start development server (Only authorization Strict mode)

Run the development server:

```bash
npm run dev
```
