# XP.network testnet Faucet Backend

This project containt the Backend part of the XP.network testnet Faucet.
Use the faucet to add XPNET tokens to a test account.

# Running the Faucet Backend


## Running for the first time

1. To install SQLite version 3 if you don't have one. Skip this step if you already have it installed.
   ```bash
    sudo apt-get install sqlite3 libsqlite3-dev
   ```
2. To create an SQL database binary

   ```bash
   touch faucet-db
   ```

3. To launch SQLite CLI:
   ```bash
   sqlite3 faucet-db
   ```
   
4. To switch off the foreign keys

   ```sql
   pragma foreign_keys = off;
   ```
5. To create the new table schema:

   ```sql
   create table `transaction_info` (
       `address` varchar not null, 
       `value` varchar not null, 
       `tx` varchar not null, 
       `timestamp` integer not null,
       primary key (`address`));
   ```
4. To turn on the foreign keys

   ```sql
   pragma foreign_keys = on;
   ```

5. To quit SQL CLI & return to the terminal
   ```terminal
   Ctrl + d
   ```



## Launching the project

Before starting the project, make sure you have access to a running substrate node or you are connected to the XP.network live testnet.

### `git pull`
To be sure, you're using the latest version of the project.

### `yarn install`
To install all the project dependancies.

### `yarn build`
To translate the TypeScript code to a JavaScript code.

If everything went well, the following lines will appear in your terminal:

```bash
yarn run v1.22.10
$ tsc -p tsconfig.json
Done in 2.63s.
```

### `node dist/index.js`
To run the project.

