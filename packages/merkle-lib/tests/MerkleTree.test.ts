// packages/merkle-lib/tests/MerkleTree.test.ts

import { MerkleTree, IMerkleProof } from '../src/MerkleTree';

describe('MerkleTree for Q2: Proof of Reserve', () => {

  it('should calculate the correct Merkle Root for the user balance data', () => {

    const leaves = [
      "(1,1111)",
      "(2,2222)",
      "(3,3333)",
      "(4,4444)",
      "(5,5555)",
      "(6,6666)",
      "(7,7777)",
      "(8,8888)",
    ];


    const leafTag = "ProofOfReserve_Leaf";
    const branchTag = "ProofOfReserve_Branch";


    const expectedRoot = "b1231de33da17c23cebd80c104b88198e0914b0463d0e14db163605b904a7ba3";


    const calculatedRoot = MerkleTree.calculateRoot(leaves, leafTag, branchTag);


    expect(calculatedRoot).toBe(expectedRoot);
  });

  it('should generate a correct Merkle proof for a specific user', () => {

    const leaves = [
      "(1,1111)",
      "(2,2222)",
      "(3,3333)",
      "(4,4444)",
      "(5,5555)",
      "(6,6666)",
      "(7,7777)",
      "(8,8888)",
    ];

    const leafTag = "ProofOfReserve_Leaf";
    const branchTag = "ProofOfReserve_Branch";

    const targetLeaf = "(3,3333)";
    const targetUserBalance = 3333;

    // Expected proof structure
    const expectedProof: IMerkleProof = {
      userBalance: targetUserBalance,
      path: [
        // Leaf level: sibling is hash of (4,4444), positioned right (position: 1)
        { hash: '8520072399ad3462db395a7a9803c6fe3f4143d502a0eb145e6c69ba7ec6d22d', position: 1 },
        // Middle level: sibling is hash of H(1,2), positioned left (position: 0)
        { hash: '99fb04c9b8fd37e66b2dde367d91f2c930b2ab162dbbf7298e9313c309c7925f', position: 0 },
        // Top level: sibling is hash of H(5,6,7,8), positioned right (position: 1)
        { hash: '9d7f79fa8e788d4a32c9c674b67dcfaf0885f539ac2699129e3c4d88c11c76e7', position: 1 },
      ]
    };

    const calculatedProof = MerkleTree.generateProof(targetLeaf, leaves, leafTag, branchTag);

    expect(calculatedProof).not.toBeNull();
    expect(calculatedProof).toEqual(expectedProof);
  });

});