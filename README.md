## Projects Overview

This collection includes the following projects:

* ### [Project 1: Merkle Root Calculation Library](./packages/merkle-lib/README.md)
    * **Description:** A TypeScript library to calculate the Merkle Root of a data array. The implementation follows specific cryptographic and structural rules inspired by the Bitcoin protocol.
    * **Tech Stack:** TypeScript, Node.js, Jest.

* ### [Project 2: Proof of Reserve Web API](./services/proof-of-reserve-api/README.md)
    * **Description:** A Node.js API built with Express.js that utilizes the Merkle Tree library to provide endpoints for calculating a total Merkle Root and generating individual Merkle Proofs for user balances.
    * **Tech Stack:** TypeScript, Node.js, Express.js, Jest.

## Suggestions for Improvement (Q3)

If this Web API were to be offered as a real production service, here are some improvements that could make it better for users and easier to manage.

### 1. User-Friendly Interface with Login System
My first idea is to build a proper frontend application using something like Next.js and TypeScript. Right now, a simple JSON API isn't very user-friendly. This frontend would include:

* **User Login:** A secure login system to protect user data.
* **Different User Types:** Regular users and auditors would see different things based on their role. This makes the auditing process faster and more secure since auditors get special access.
* **Easy Verification Tool:** A simple page where users can click a button to create and view their own Merkle Proof. This would make a complex process much easier to understand and help users trust the system.

### 2. Complete Activity Tracking
To track what's happening and keep things secure, the API should record all important actions.

* **Activity Records:** We need a strong logging system that keeps track of all API requests and system events. This is important for monitoring the system and investigating any problems.
* **Protecting Privacy:** The logging system must respect user privacy. It wouldn't record sensitive personal information - only what's needed for debugging and security checks.

### 3. Using Docker for Easy Deployment
To make the service easy to deploy and scale up, I would use Docker.

* **Create a Docker Package:** I would create a `Dockerfile` for the API service. This bundles the application with everything it needs into one container that works anywhere.
* **Why This Helps:** Using Docker means the application runs exactly the same way everywhere - whether on a developer's laptop or production servers. It makes deployment much simpler and is the foundation for growing and managing the service later.

## Core Principles

Across all projects in this repository, the following principles were prioritized:

* **Maintainability:** Code is written to be clear, readable, and easily managed by a team.
* **Correctness:** Solutions are thoroughly verified with a comprehensive suite of tests.
* **Minimal Dependencies:** Runtime dependencies are avoided wherever possible to ensure a lean and secure final product.