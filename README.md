## Description

This application uses NestJS framework along with TypeORM and PostgreSQL for database implementation.

## Pre-installation
Please make sure that you installed PostgreSQL before running the app. In the .env please fill out all the required configurations for database connection.
Example:

```bash
PORT=8080
BASE_URL=localhost:8080
CLIENT_BASE_URL=localhost:3000

DATABASE_HOST=localhost
DATABASE_NAME=nest_api
DATABASE_USER=postgres
DATABASE_PASSWORD=admin
DATABASE_PORT=5432
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
