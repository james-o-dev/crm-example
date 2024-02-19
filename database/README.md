# Database | CRM Example

- [Database | CRM Example](#database--crm-example)
  - [Description](#description)
  - [Pre-requisites](#pre-requisites)
    - [Local database](#local-database)
    - [Remote database](#remote-database)
  - [Getting Started](#getting-started)

## Description

The CRM Example project uses PostgreSQL (a.k.a. Postgres) as the database type of choice.

Setting up the database is required for the server API and normal functionality of the CRM Example web app in general.

This folder contains the scripts and content necessary to set this up.

## Pre-requisites

Knowledge of Postgres.

You require a PostgreSQL (v15+) database. You may either use locally (recommended) for development purposes or one that is hosted remotely.

Required:
* Postgres host
* Postgres port
* Postgres database name
* Postgres username
* Postgres password

Additionally, you require a tool or a method to apply changes to the database, such as with [DBeaver](https://dbeaver.io/) or [pgAdmin4](https://www.pgadmin.org/download/pgadmin-4-windows/) or a tool or method you are most comfortable with.

It is recommended to [create a new separate database](https://www.postgresql.org/docs/current/sql-createdatabase.html).

### Local database

You can install [Postgres](https://www.postgresql.org/) to your local machine and then continue.

Follow the instructions when installing, set a password and remember the username and password.

### Remote database

This is required if deploying the API server remotely.

If you do not have a remote database at hand, you can always sign-up for free ones, like [Supabase](https://supabase.com/).

## Getting Started

* Connect to the Postgres database.
* Apply the schema scripts **in order**, in the [schema](./schema/) folder:
  * [0_pre_tables.sql](./schema/0_pre_tables.sql)
  * [1_tables.sql](./schema/1_tables.sql)
  * [2_functions.sql](./schema/2_functions.sql)