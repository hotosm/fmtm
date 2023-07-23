# Database Tips

## Access the database (psql)

Enter the database docker container with PSQL shell:

```bash
docker exec -it fmtm-db psql -U fmtm fmtm
```

## Backup

Dump the database to a custom format backup:

```bash
backup_filename="fmtm-db-backup-$(date +'%Y-%m-%d').gz"
docker exec -i -e PGPASSWORD=PASSWORD_HERE fmtm_db pg_dump \
    --verbose --format c -U fmtm fmtm | gzip -9 > "$backup_filename"
```

> Note: it is recommended to use pg_dump --format c, as it is much
> more flexible. It can be converted to a .sql later if required.

## Restore

Run your new database container called `fmtm_db_new`, e.g.:

```bash
docker run -d --name fmtm_db_new \
    -e POSTGRES_USER=fmtm \
    -e POSTGRES_DB=fmtm \
    -e POSTGRES_PASSWORD=NEW_PASSWORD_HERE \
    postgis/postgis:14-3.3-alpine
```

> Note: this step is optional. You can use `fmtm_db` from the compose stack instead.

Unzip and restore from the database dump:

```bash
cat "$backup_filename" | gunzip | docker exec -i \
    -e PGPASSWORD=NEW_PASSWORD_HERE \
    fmtm_db_new pg_restore --verbose -U fmtm -d fmtm
```

## Migrations

- Migrations are not currently handled by a tool such as Alembic.
- This was a design choice, to simplify the code and dependencies.
- Instead migrations can be made manually on existing databases.

Connect to the database:

```bash
docker exec -it fmtm_db psql -U fmtm fmtm
```

Run your SQL migration, e.g.:

```sql
ALTER TABLE public.projects ADD COLUMN hashtags varchar[];
```

Then quit PSQL with `\q`.
