# Not all Board Games are the Same

## Getting Started

### Prerequisites

Before getting started, make sure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)
- PostgreSQL


## Installing Dependencies

Run the following command to install project dependencies:

```bash
npm install

```

## Setting Up Environment Variables

This project uses environment variables to configure database connections. Follow these steps to set up the necessary environment variable files:

### 1. Create a `.env.development` file in the project root for development:
Database Configuration for development. Copy the following into your .env file

```
PGDATABASE=database_name
```
### 2. Create a `` file in the project root for testing:
Database Configuration for test. Copy the following into your .env file

```plaintext
PGDATABASE=database_name_test
```


## Running Scripts

The project includes the following npm scripts:


To setup the databases run:
```bash
npm run setup-dbs

```
To seed the database run and test the development environment:
```bash
npm run seed

```
