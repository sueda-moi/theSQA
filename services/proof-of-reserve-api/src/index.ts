// services/proof-of-reserve-api/src/index.ts

import express from 'express';
import { MerkleTree } from 'merkle-lib';

// 1. initialize 
const app = express();
const PORT = 3000; 

// 2. prepare data
const userDatabase = [
  { id: 1, balance: 1111 }, { id: 2, balance: 2222 },
  { id: 3, balance: 3333 }, { id: 4, balance: 4444 },
  { id: 5, balance: 5555 }, { id: 6, balance: 6666 },
  { id: 7, balance: 7777 }, { id: 8, balance: 8888 },
];
const leafTag = "ProofOfReserve_Leaf";
const branchTag = "ProofOfReserve_Branch";

// 3. performance optimization: pre-calculate
console.log("Server starting up, calculating Merkle Tree...");
const leaves = userDatabase.map(user => `(${user.id},${user.balance})`);
const merkleRoot = MerkleTree.calculateRoot(leaves, leafTag, branchTag);
console.log("Merkle Tree calculation complete. Root:", merkleRoot);


// 4. implement the first API endpoint: GET /merkle-root
app.get('/merkle-root', (req, res) => {
  console.log(`-> Received request for GET /merkle-root`);
  res.json({
    merkleRoot: merkleRoot
  });
});

// 5. implement the second API endpoint: GET /merkle-proof/:userId
app.get('/merkle-proof/:userId', (req, res) => {
  const userIdParam = req.params.userId;
  console.log(`-> Received request for GET /merkle-proof/${userIdParam}`);

  // Parse userId from URL parameters and do basic validation
  const userId = parseInt(userIdParam, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'User ID must be a number.' });
  }

  // Find user in the "database"
  const user = userDatabase.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Prepare data for calling the library
  const targetLeaf = `(${user.id},${user.balance})`;

  // Call our powerful merkle-lib library to generate proof!
  const proof = MerkleTree.generateProof(targetLeaf, leaves, leafTag, branchTag);

  // Return the proof
  if (proof) {
    res.json(proof);
  } else {
    // Under normal circumstances, if the user exists, we should always be able to generate a proof here
    res.status(500).json({ error: 'Could not generate proof.' });
  }
});


// 6. start the server
app.listen(PORT, () => {
  console.log(`\nProof of Reserve API server is ready and running on http://localhost:${PORT}`);
});