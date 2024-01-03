---
sidebar_position: 1
---

# Controller Setup

## FrameOS controller

The FrameOS controller is the application you use to deploy FrameOS onto individual devices.

Once deployed, the frames don't need the controller to function. It's still useful to keep it up for log aggregation.


![FrameOS walkthrough](../_img/walkthrough.gif)

## Running via docker

The easiest way to run the FrameOS controller is via Docker.

```bash
# generate a stable secret key
SECRET_KEY=$(openssl rand -base64 32)

# run the latest release
docker run -d --name frameos --restart always \
        -p 8989:8989 \
        -v ./db:/app/db \
        -e SECRET_KEY="$SECRET_KEY" \
        frameos/frameos:latest
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

Keep in mind that FrameOS is in early development, and despite best efforts, there are no guarantees of stability between releases. 

## Developing via docker

If you want to run the development build locally via docker:

```bash
# build your own
git clone https://github.com/FrameOS/frameos/
docker build frameos -t frameos
docker run -d -p 8989:8989 -v ./db:/app/db --name frameos frameos
```

Then load http://0.0.0.0:8989, preferably with a local IP that your frames can connect to.

![](./_img/7-docker-fast-frameos.gif)

## Setup the frame

You're now ready to add frames to FrameOS.

Read the relevant [device specific guide](/devices), and setup the connected [raspberry pi](/installation/raspberry).

Once both can see each other with the IPs and ports you provide, add them to FrameOS.

![](./_img/15-multiple.gif)

## Install apps on the frame

Next, read about the [apps](/apps) you can install, and about writing your own.
