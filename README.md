# VidLib
Video library for videos of an account based on Peertube REST API with can usage creator portal. Are you a creator trying to set up memberships? Well, you've come to the right place. This simple app will show you how to create and manage your own memberships.

## What is PeerTube?

PeerTube allows you to create your own video platform, in complete independence. With PeerTube, no more opaque algorithms or obscure moderation policies! PeerTube platforms you visit are built, managed and moderated by their owners. PeerTube allows platforms to be connected to each other, creating a big network of platforms that are both autonomous and interconnected. Moreover, PeerTube does not depend on any advertising and does not track you!

For more information visit this website:

```bash
https://joinpeertube.org
```

## Live demo

```bash
https://vidlib.barkoczy.social
```

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
