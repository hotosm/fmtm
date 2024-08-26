# FMTM Mapper

A standalone mobile UI for the mapper interface.

- First build the image:

```bash
docker compose build ui-mapper
```

- Then start the docker compose stack:

```bash
docker compose up -d
```

- The UI runs behind the same Nginx proxy, under the path:

```html
https://DOMAIN/mapnow/{projectId}
```
