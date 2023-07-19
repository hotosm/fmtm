# Database Tips

## Access the database (psql)

Enter the database docker container with PSQL shell:

```bash
docker exec -it fmtm-db psql -U fmtm fmtm
```

## Backup

Dump the database to a .sql backup:

```bash
backup_filename="fmtm-db-backup-$(date +'%Y-%m-%d').sql.gz"
docker exec -i -e PGPASSWORD=PASSWORD_HERE fmtm_db pg_dump \
    -U fmtm fmtm | gzip -9 > "$backup_filename"
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
