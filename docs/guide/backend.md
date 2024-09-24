---
sidebar_position: 1
---

# The Backend

To use FrameOS, you'll need to self host the backend. 

This webapp:

![FrameOS backend](./_img2/frameos-backend.gif)

You'll need to host the backend somewhere that has direct SSH access to the frames.

If you need to punch through firewalls, [Tailscale](https://tailscale.com/) is a nice option.

## Quick install

The easiest way to install the FrameOS backend on a Mac or Debian/Ubuntu Linux is to run the following installation script:

```bash
curl -fsSL https://frameos.net/install.sh | bash
```

## Running via docker

The second-easiest way to run the FrameOS backend is via Docker. This is what the script above does.

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

Then load http://0.0.0.0:8989.

## Setup the raspberry

You're now ready to add frames to FrameOS.

Follow the [Raspberry Pi setup guide](/guide/raspberry) for the next steps.