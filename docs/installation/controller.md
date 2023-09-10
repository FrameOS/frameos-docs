---
sidebar_position: 1
---

# Controller Setup

## FrameOS controller

The FrameOS controller is where you set up your frames. You can run it continuously on a server, or locally on your computer when needed. You'll miss out on log aggregation if the FrameOS server is not always on. The frames however will keep on running and updating independently.

![2023-08-21 01 11 13](https://github.com/mariusandra/frameos/assets/53387/25e5666b-e380-4115-bedf-b149e332a1b1)

## Running via docker

Running FrameOS via Docker is the easiest. Alternatively deploy it you'd deploy any Python + React app.

```bash
# running the latest release
docker run -d -p 8999:8999 -v data:/app/data mariusandra/frameos

# build your own from this repository
docker build . -t frameos
docker run -d -p 8999:8999 -v data:/app/data frameos
```

Then load http://0.0.0.0:8999 - ideally using a local IP that your frames can connect to.

![](./_img/7-docker-fast-frameos.gif)

## Install the frame

Finally, add the frame to FrameOS. Make sure both can ping each other with the IPs given.

![](./_img/8-deploy-frame.gif)

If everything well and you have a good deploy

![](./_img/11-good-deploy.gif)

... you should see something like this:

![](./_img/12-parrot.gif?)

Repeat the process to add more frames

![](./_img/15-multiple.gif)

