# Merkle Root Calculation Library

A TypeScript library to calculate the Merkle Root of a string array, following Bitcoin-specific rules. This project was created as part of a coding challenge.

## Installation

Clone the repository and install the necessary development dependencies:

```bash
git clone https://github.com/sueda-moi/theSQA
npm install
```

## Usage

You can import and use the `MerkleTree` class to calculate a Merkle Root.

```typescript
import { MerkleTree } from './merkle-lib/src/MerkleTree';

const leaves = ["aaa", "bbb", "ccc", "ddd", "eee"];
const merkleRoot = MerkleTree.calculateRoot(leaves);

console.log(merkleRoot);
// Output: 289c207478c3e592fcc30f8171a52a05bfb933312f2fd287d52d9fc3b960d59e
```

## Running Tests

To run the included tests and verify the correctness of the implementation, execute the following command:

```bash
npm test
```

The test suite will confirm that the library produces the correct Merkle Root for the example provided in the challenge.

## Implementation Details & Logic

This library was built according to the provided specifications, which contained potentially conflicting instructions. The final, successful implementation resolves this ambiguity with the following logic:

* **Leaf Nodes :** Hashed using the specified **BIP340-compatible tagged hash** with the tag `"Bitcoin_Transaction"`. This special hash is used as an "entry" function to process the initial raw data into the Merkle tree system.

* **Branch (Parent) Nodes :** Hashed using the standard Bitcoin convention of **double-SHA256 (`SHA256(SHA256(data))`)**. Once the leaves are processed, the internal structure of the tree is built following the standard practices of a Bitcoin transaction Merkle tree.

* **Odd Nodes :** If a level contains an odd number of nodes, the last node is duplicated and hashed with itself to create a pair for the next level, as per the standard Bitcoin protocol.

## Dependencies Used

This project relies only on **development dependencies** for compilation, testing, and type safety. The final library code itself has **zero runtime dependencies**.

* **typescript**: The compiler for the TypeScript language.
* **jest**, **ts-jest**, **@types/jest**: The testing framework used to verify the correctness of the Merkle tree logic.
* **@types/node**: Provides TypeScript type definitions for Node.js built-in modules like `crypto`.