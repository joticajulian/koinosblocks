# koinosblocks

Koinos blockchain explorer utilizing public RPC API without any custom backend.

# Development

To run the development server, first install required dependencies:

```shell
yarn install
```

And them run the development server:

```shell
yarn run dev
```

Your application will be available at http://localhost:5173


# Docker

You can also run dockerized version of the application (build for production). You can build locally with:

```shell
docker build -t koinosblocks .
```

And then run it with:

```shell
docker run -p 80:80 koinosblocks
```

Your application will be available at http://localhost:80

You can also pull the image from gitlab docker registry:

```shell
docker pull registry.gitlab.com/engrave/koinos/koinosblocks:latest
```

And then run it with:

```shell
docker run -p 80:80 registry.gitlab.com/engrave/koinos/koinosblocks:latest
```
# License

MIT
