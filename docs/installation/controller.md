---
sidebar_position: 1
---

# Controller Setup

## FrameOS controller

The FrameOS controller is where you set up your frames. You can run it continuously on a server, or locally on your computer when needed. You'll miss out on log aggregation if the FrameOS server is not always on. The frames however will keep on running and updating independently.

![FrameOS walkthrough](../_img/walkthrough.gif)

## Running via docker

The easiest way to run the controller is via Docker.

```bash
# generate a stable secret key
SECRET_KEY=$(openssl rand -base64 32)

# run the latest release
docker run -d --name frameos --restart always 
        -p 8999:8999 \
        -v ./db:/app/db \
        -e SECRET_KEY="$SECRET_KEY" \
        mariusandra/frameos:latest
```

If you want to keep the container up to date, use watchtower:

```bash
# update daily to the latest release
docker run -d \
    --name watchtower \
    -v /var/run/docker.sock:/var/run/docker.sock \
    containrrr/watchtower \
    --interval 86400
    frameos

# one time update
docker run \
    -v /var/run/docker.sock:/var/run/docker.sock \
    containrrr/watchtower \
    --run-once \
    frameos
```

## Developing via docker

If you want to run the development build locally via docker:

```bash
# build your own
git clone https://github.com/mariusandra/frameos/
docker build frameos -t frameos
docker run -d -p 8999:8999 -v ./db:/app/db --name frameos frameos
```

Then load http://0.0.0.0:8999, preferably with a local IP that your frames can connect to.

![](./_img/7-docker-fast-frameos.gif)

## Setup the frame

You're now ready to add frames to FrameOS.

Read the relevant [device specific guide](/devices), and setup the connected [raspberry pi](/installation/raspberry).

Once both can see each other with the IPs and ports you provide, add them to FrameOS.

![](./_img/15-multiple.gif)

## Install apps on the frame

Next, read about the [apps](/apps) you can install, and about writing your own.
