## Setup

1. **Env** — Copy `.env.example` to `.env` and set:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (PostgreSQL)
   - `PROBATION_API_KEY` (if using probation API)
2. **Install** — `npm install`
3. **DB** — Ensure PostgreSQL is running, then: `npm run migration:run`
4. **Run** — `npm run start:dev` (dev) or `npm run start:prod` (prod)

## API docs (Swagger)

**http://localhost:3000/api/docs**

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
