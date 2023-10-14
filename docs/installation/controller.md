---
sidebar_position: 1
---

# Controller Setup

## FrameOS controller

The FrameOS controller is where you set up your frames. You can run it continuously on a server, or locally on your computer when needed. You'll miss out on log aggregation if the FrameOS server is not always on. The frames however will keep on running and updating independently.

![FrameOS walkthrough](../_img/walkthrough.gif)

## Running via docker


```bash
# running the latest release
SECRET_KEY=$(openssl rand -base64 32)
docker run -d -p 8999:8999 -v ./db:/app/db --name frameos --restart always -e SECRET_KEY="$SECRET_KEY" mariusandra/frameos

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

Alternatively, if you want to develop locally via docker:

```bash
# build your own
git clone https://github.com/mariusandra/frameos/
docker build frameos -t frameos
docker run -d -p 8999:8999 -v ./db:/app/db --name frameos frameos
```

Then load http://0.0.0.0:8999 - ideally using a local IP that your frames can connect to.

![](./_img/7-docker-fast-frameos.gif)

## Install the frame

Now you're ready to add frames to FrameOS. Make sure both can ping each other with the IPs given.

![](./_img/8-deploy-frame.gif)

If everything well and you have a good deploy

![](./_img/11-good-deploy.gif)

... you should see something like this:

![](./_img/12-parrot.gif?)

Repeat the process to add more frames

![](./_img/15-multiple.gif)

