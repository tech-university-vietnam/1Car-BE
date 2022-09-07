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

# Integrate with Auth0

I config ultrahook to work with Auth0 post registration hook.
When sign up using Auth0 universal login successfully, it will send info to the below endpoint.

The api key: HPVB6Nap29id7WFMSagiLYCekexfKEcQ

The post registration will hit https://ninahuynh-auth0.ultrahook.com.
This will proxy to http://localhost:8080, our backend app.

## Get started with ultrahook

Save the Api key:
```echo "api_key: HPVB6Nap29id7WFMSagiLYCekexfKEcQ" > ~/.ultrahook```

And install the UltraHook client:
```gem install ultrahook```

