# Odysseat

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.


## Usage

### Local Development
1.  Copy the `.env.example` file to `.env`.
2. If using Laragon, use [this guide](https://dev.to/dendihandian/adding-postgresql-to-laragon-2kde) to add Postgres to your instance, run it locally, and modify the `DATABASE_URL` variable inside `.env` to have the correct credentials. Otherwise, run:
```
./start-database.sh
```

3. Run the app in development mode with:
```
npm run dev
```

4. Migrate the DB to the schema defined in `src/server/db/schema/schema.ts`
```
npm run db:push
```

### Deployment

TBD...