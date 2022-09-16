# Portfolio API

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![Build Badge](https://github.com/FaZeRs/portfolio-api/workflows/build/badge.svg)
![Tests Badge](https://github.com/FaZeRs/portfolio-api/workflows/tests/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=FaZeRs_portfolio-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=FaZeRs_portfolio-api)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=FaZeRs_portfolio-api&metric=coverage)](https://sonarcloud.io/dashboard?id=FaZeRs_portfolio-api)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=FaZeRs_portfolio-api&metric=code_smells)](https://sonarcloud.io/dashboard?id=FaZeRs_portfolio-api)

| Repository                                                          | Info               |
|---------------------------------------------------------------------|--------------------|
| [portfolio-client](https://github.com/FaZeRs/portfolio-client)      | Frontend           |
| [portfolio-api](https://github.com/FaZeRs/portfolio-api)            | Rest API           |
| [portfolio-server](https://github.com/FaZeRs/portfolio-server)      | Docker Environment |

## Features

| Feature                  | Info                                                           |
|--------------------------|----------------------------------------------------------------|
| Authentication           | [JWT](https://github.com/auth0/node-jsonwebtoken)              |
| Authorization            | RBAC (Role based)                                              |
| ORM Integration          | [TypeORM](https://github.com/typeorm/typeorm)                  |
| DB Migrations            | [TypeORM](https://github.com/typeorm/typeorm)                  |
| Logging                  | [winston](https://github.com/winstonjs/winston)                |
| Request Validation       | [class-validator](https://github.com/typestack/class-validator)|
| Pagination               | SQL offset & limit                                             |
| Docker Ready             | [Dockerfile](https://www.docker.com/)                          |
| Auto-generated OpenAPI   | -                                                              |
| Auto-generated ChangeLog | [Release Please](https://github.com/googleapis/release-please) |
| Queue                    | [Bull](https://github.com/OptimalBits/bull)                    |
| File System              | [Minio](https://github.com/minio/minio)                        |
| Mailing                  | [Nodemailer](https://github.com/nodemailer/nodemailer)         |

## Installation

Note: when using docker, all the `npm` commands can also be performed using `./scripts/npm` (for example `./scripts/npm install`).
This script allows you to run the same commands inside the same environment and versions than the service, without relying on what is installed on the host.

```bash
$ npm install
```

Create a `.env` file from the template `.env.template` file.

Generate public and private key pair for jwt authentication:

### With docker

Run this command:
```bash
./scripts/generate-jwt-keys
```

It will output something like this. You only need to add it to your `.env` file.
```
To setup the JWT keys, please add the following values to your .env file:
JWT_PUBLIC_KEY_BASE64="(long base64 content)"
JWT_PRIVATE_KEY_BASE64="(long base64 content)"
```

### Without docker

```bash
$ ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
# Don't add passphrase
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

You may save these key files in `./local` directory as it is ignored in git.

Encode keys to base64:

```bash
$ base64 -i local/jwtRS256.key

$ base64 -i local/jwtRS256.key.pub
```

Must enter the base64 of the key files in `.env`:

```bash
JWT_PUBLIC_KEY_BASE64=BASE64_OF_JWT_PUBLIC_KEY
JWT_PRIVATE_KEY_BASE64=BASE64_OF_JWT_PRIVATE_KEY
```

## Running the app

We can run the project with or without docker.

### Local

To run the server without Docker we need this pre-requisite:

- MySQL server running
- Redis server running
- Minio server running

Commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network --env-file .env my-app

# run using docker compose
$ docker compose up
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

## Migrations

```bash
# generate migration (replace CreateUsers with name of the migration)
$ npm run migration:generate -- -n CreateUsers

# run migration
$ npm run migration:run

# revert migration
$ npm run migration:revert
```

## Architecture

- [Project Structure](./docs/project-structure.md)

## Contributors

- [Nauris Linde](https://github.com/FaZeRs)

## External Links

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo.svg" width="150" alt="Nest Logo" /></a>

<a href="https://github.com/monstar-lab-oss/nestjs-starter-rest-api" target="blank"><img src="https://avatars.githubusercontent.com/u/60748511" height="100" alt="Monstarlab Logo" /></a>

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=FaZeRs_portfolio-api)
