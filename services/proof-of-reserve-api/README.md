# Proof of Reserve Web API

This project is a simple Web API built with Node.js and Express.js to provide Proof of Reserve functionalities using a Merkle Tree.

It serves as the second part of a multi-stage coding challenge and utilizes the `merkle-lib` library developed in the first part.

## Features

The API provides two main endpoints:

1.  `GET /merkle-root`: Returns the single Merkle Root for the entire in-memory user database.
2.  `GET /merkle-proof/:userId`: Returns a specific Merkle Proof for a given user ID, which can be used to independently verify their inclusion in the reserve.

## Setup & Installation

This project is part of an NPM Workspace monorepo.

1.  Navigate to the **root directory** of the monorepo.
2.  Install all dependencies for all workspaces:
    ```bash
    npm install
    ```

## Running the Server

To start the API server, run the following command from the **root directory** of the monorepo:

```bash
npm start -w proof-of-reserve-api
```

The server will start and listen on `http://localhost:3000`.

## API Usage Examples

You can test the endpoints using a tool like `curl` or by visiting the URLs directly in your web browser.

* **Get the Merkle Root:**
    ```bash
    curl http://localhost:3000/merkle-root
    ```
    **Expected Response:**
    ```json
    {
      "merkleRoot": "b1231de33da17c23cebd80c104b88198e0914b0463d0e14db163605b904a7ba3"
    }
    ```

* **Get a Merkle Proof for User ID 3:**
    ```bash
    curl http://localhost:3000/merkle-proof/3
    ```
    **Expected Response:**
    ```json
    {
      "userBalance": 3333,
      "path": [
        { "hash": "8520072399ad3462db395a7a9803c6fe3f4143d502a0eb145e6c69ba7ec6d22d", "position": 1 },
        { "hash": "99fb04c9b8fd37e66b2dde367d91f2c930b2ab162dbbf7298e9313c309c7925f", "position": 0 },
        { "hash": "9d7f79fa8e788d4a32c9c674b67dcfaf0885f539ac2699129e3c4d88c11c76e7", "position": 1 }
      ]
    }
    ```