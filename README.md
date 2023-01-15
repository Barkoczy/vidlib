# VidLib
Video library for videos of an account based on PeerTube REST API with can usage creator portal. Are you a creator trying to set up memberships? Well, you've come to the right place. This simple app will show you how to create and manage your own memberships.

## Live demo

```bash
https://vidlib.barkoczy.social
```

## What is PeerTube?

PeerTube allows you to create your own video platform, in complete independence. With PeerTube, no more opaque algorithms or obscure moderation policies! PeerTube platforms you visit are built, managed and moderated by their owners. PeerTube allows platforms to be connected to each other, creating a big network of platforms that are both autonomous and interconnected. Moreover, PeerTube does not depend on any advertising and does not track you!

For more information visit this website:

```bash
https://joinpeertube.org
```

## Setup

Create .env file and fill empty fields. If needed edit default setup values.

### Setup options

#### Authorization mode

* Strict
* Credentials
* PeerTube
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

Run webpack bundler:

```bash
npm run build:webpack:dev
```

Run the development server:

```bash
npm run dev
```

## Deploy on server

Install dependencies:

```bash
npm i --save
```

Run webpack bundler:

```bash
npm run build:webpack:prod
```

Make build:

```bash
npm run build
```

### Run node.js service with systemd

Create service file /etc/systemd/system/vidlib.service:

```bash
[Unit]
Description=VidLib

[Service]
ExecStart=/usr/bin/npx ts-node /var/nodeapp/src/server.ts
# Required on some systems
#WorkingDirectory=/var/nodeapp
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodejs-example
#User=<alternate user>
#Group=<alternate group>
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable the service:

```bash
systemctl enable vidlib.service
```

Start the service:

```bash
service vidlib start
```

or

```bash
systemctl start nodeserver.service
```
