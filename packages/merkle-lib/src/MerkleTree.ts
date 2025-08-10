import * as crypto from 'crypto';

// Define the structure of each proof path node
export interface IProofPathNode {
    hash: string; //  Sibling node hash (hex format)
    position: 0 | 1; // Sibling node position: 0 for left, 1 for right
}

// Define the full Merkle proof data structure
export interface IMerkleProof {
    userBalance: number; // User's balance
    path: IProofPathNode[]; // Proof path from leaf to root
}


export class MerkleTree {



    /**
     * Implements the BIP340 compatible tagged hash for strong domain separation.
     * The use of a tagged hash is crucial to prevent cross-protocol attacks, ensuring
     * that a hash generated for this specific purpose cannot be misinterpreted in
     * another context.
     * The hash is calculated as: SHA256(SHA256(tag) || SHA256(tag) || data).
     * The H(tag)||H(tag) prefix fills the entire first 64-byte block of the SHA-256
     * algorithm, creating a unique and isolated hashing "domain" specific to the tag.
     *
     * @param tag A string that defines the hashing domain (e.g., "Bitcoin_Transaction").
     * @param data The input data to be hashed.
     * @returns A Buffer containing the raw binary hash.
     */
    private static taggedHash(tag: string, data: string | Buffer): Buffer {

        // 1. First, hash the tag itself to get a unique, fixed-size (32-byte)
        // identifier for the domain.
        const tagHash = crypto.createHash('sha256').update(tag).digest();

        // 2. If the data is a string, convert it to a Buffer. This ensures that
        // the input is always in a consistent format for hashing.
        const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

        // 3. Construct the buffer to be hashed according to the BIP340 specification.
        // The prefix consists of the tag hash repeated twice.
        const combined = Buffer.concat(
            [
                tagHash,
                tagHash,
                dataBuffer
            ]
        );

        // 4. Hash the combined buffer to produce the final tagged hash.
        // 5. Return the result as a raw Buffer. This is essential for subsequent
        // cryptographic operations like concatenating two hashes together.
        return crypto.createHash('sha256').update(combined).digest();

    }

    /**
     * Builds a Merkle tree from the given leaves.
     * @param leaves An array of strings representing the leaf nodes.
     * @param leafTag The tag to use for hashing leaf nodes.
     * @param branchTag The tag to use for hashing branch (parent) nodes.
     * @returns A 2D array representing the Merkle tree, where each inner array is a level of the tree.
     */
    private static buildTree(leaves: string[], leafTag: string, branchTag: string): Buffer[][] {
        // Handle the edge case of an empty list. Returns the hash of an empty string.
        if (leaves.length === 0) {
            return [[this.taggedHash(leafTag, "")]];
        }

        // Level 0: Hash each leaf using the specific LEAF tag.
        const leafLevel: Buffer[] = leaves.map(leaf =>
            this.taggedHash(leafTag, leaf)
        );

        const tree: Buffer[][] = [leafLevel];
        let currentLevel = leafLevel;

        // Loop to build each level of the tree
        while (currentLevel.length > 1) {
            const nextLevel: Buffer[] = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = (i + 1 < currentLevel.length) ? currentLevel[i + 1] : left;
                const combinedData = Buffer.concat([left, right]);
                const parent = this.taggedHash(branchTag, combinedData);
                nextLevel.push(parent);
            }
            tree.push(nextLevel); // Store the newly generated level in the tree
            currentLevel = nextLevel;
        }

        return tree;
    }


    /**
     * Calculates the Merkle Root for a given array of string leaves.
     * @param leaves An array of strings representing the data.
     * @param leafTag The tag to use for hashing leaf nodes.
     * @param branchTag The tag to use for hashing branch (parent) nodes.
     * @returns The Merkle Root as a hexadecimal string.
     */
    public static calculateRoot(leaves: string[], leafTag: string, branchTag: string): string {

        const tree = this.buildTree(leaves, leafTag, branchTag);

        // The last layer of the tree has only one element, which is the root node
        return tree[tree.length - 1][0].toString('hex');

    }

    /**
     * Generates a Merkle proof for a specific leaf node.
     * @param targetLeaf The leaf node to generate the proof for.
     * @param leaves The list of all leaf nodes in the Merkle tree.
     * @param leafTag The tag to use for hashing leaf nodes.
     * @param branchTag The tag to use for hashing branch (parent) nodes.
     * @returns The Merkle proof or null if not found.
     */

    public static generateProof(
        targetLeaf: string,
        leaves: string[],
        leafTag: string,
        branchTag: string
    ): IMerkleProof | null {

        // 1. Identify the target leaf's index
        let targetIndex = leaves.findIndex(leaf => leaf === targetLeaf);

        // If the target leaf is not found, return null
        if (targetIndex === -1) {
            return null;
        }

        // 2. Build the Merkle tree
        const tree = this.buildTree(leaves, leafTag, branchTag);

        // If the tree has only one element, it means the target leaf is the root
        if (tree.length <= 1) {
            // Extract the user's balance and return an empty proof path
            const userBalance = parseInt(targetLeaf.split(',')[1].replace(')', ''));
            return { userBalance, path: [] };
        }

        // 3. Initialize the proof path
        const proofPath: IProofPathNode[] = [];

        // 4. Start from the target index and traverse up the tree
        for (let level = 0; level < tree.length - 1; level++) {
            const currentLevel = tree[level];
            const siblingIndex = (targetIndex % 2 === 0)
                ? targetIndex + 1 // if target is on the left (even index), sibling is on the right
                : targetIndex - 1; // if target is on the right (odd index), sibling is on the left

            // Determine the position of the sibling node (0=left, 1=right)
            const position = (targetIndex % 2 === 0) ? 1 : 0;

            let siblingNode: IProofPathNode;

            if (siblingIndex < currentLevel.length) {
                // If the sibling node exists, add it normally
                siblingNode = {
                    hash: currentLevel[siblingIndex].toString('hex'),
                    position: position,
                };
            } else {
                // If the sibling node does not exist (meaning the target is the last odd node at this level),
                // then its "sibling" is itself.
                siblingNode = {
                    hash: currentLevel[targetIndex].toString('hex'),
                    position: position,
                };
            }

            proofPath.push(siblingNode);

            // 5: Update targetIndex to prepare for the calculation of the upper layer
            // Its position in the upper layer is its current position divided by 2 and floored
            targetIndex = Math.floor(targetIndex / 2);
        }

        // 6: Parse the user balance from the target leaf string
        // e.g., extract 7777 from "(7,7777)"
        const userBalance = parseInt(targetLeaf.split(',')[1].replace(')', ''));

        return {
            userBalance: userBalance,
            path: proofPath,
        };
    }

}