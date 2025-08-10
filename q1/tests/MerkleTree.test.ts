import { MerkleTree } from "../src/MerkleTree";

describe('MerkleTree', () => {
    it('should calculate the correct Merkle Root for the given example array', () => {
        const leaves = ["aaa", "bbb", "ccc", "ddd", "eee"];
        const expectedRoot = "289c207478c3e592fcc30f8171a52a05bfb933312f2fd287d52d9fc3b960d59e";


        const calculatedRoot = MerkleTree.calculateRoot(leaves);
        expect(calculatedRoot).toBe(expectedRoot);
    });

    it('should handle an empty array correctly', () => {
        const leaves: string[] = [];
        const calculatedRoot = MerkleTree.calculateRoot(leaves);

        expect(calculatedRoot).toBeDefined();
        expect(typeof calculatedRoot).toBe('string');
    });

});



