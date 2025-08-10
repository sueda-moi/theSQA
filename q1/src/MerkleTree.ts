import * as crypto from 'crypto';

export class MerkleTree {

    private static readonly TRANSACTION_TAG = "Bitcoin_Transaction";


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
        const finalHash = crypto.createHash('sha256').update(combined).digest();

        // 5. Return the result as a raw Buffer. This is essential for subsequent
        // cryptographic operations like concatenating two hashes together.
        return finalHash;

    }

    /**
     * Implements the standard Bitcoin double-SHA256 hash.
     * This is used for all internal branch nodes of the tree.
     */
    private static doubleHash(data: Buffer): Buffer {
        const firstHash = crypto.createHash('sha256').update(data).digest();
        const secondHash = crypto.createHash('sha256').update(firstHash).digest();
        return secondHash;
    }

    /**
     * Calculates the Merkle Root for a given array of string leaves.
     * This method follows the Bitcoin protocol for building Merkle Trees,
     * including the rule for duplicating the last node if a level has an odd number of nodes.
     * @param leaves An array of strings representing the data to be included in the tree.
     * @returns The final Merkle Root, encoded as a hexadecimal string.
     */
    public static calculateRoot(leaves: string[]): string {

        // Handle the edge case of an empty list. Returns the hash of an empty string.
        if (leaves.length === 0) {
            return this.taggedHash(this.TRANSACTION_TAG, "").toString('hex');
        }

        // Handle the edge case of a single leaf. Its hash is the root.
        if (leaves.length === 1) {
            return this.taggedHash(this.TRANSACTION_TAG, leaves[0]).toString('hex');
        }

        // Level 0: Start by hashing each leaf in the input array to form the initial level.
        let currentLevel: Buffer[] = leaves.map(leaf =>
            this.taggedHash(this.TRANSACTION_TAG, leaf)
        );


        // Repeatedly process levels until only one hash (the root) remains.
        while (currentLevel.length > 1) {

            const nextLevel: Buffer[] = [];

            // Process the current level in pairs.
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];

                // The crucial Bitcoin rule: If there's an odd number of nodes,
                // the last node is paired with a copy of itself.
                const right = (i + 1 < currentLevel.length) ? currentLevel[i + 1] : left;

                // Concatenate the left and right hashes into a single buffer.
                const combinedData = Buffer.concat([left, right]);

                // Hash the combined pair to create their parent node for the next level.
                //const parent = this.taggedHash(this.TRANSACTION_TAG, combinedData);
                const parent = this.doubleHash(combinedData);
                nextLevel.push(parent);
            }

            // Move up the tree: the next level becomes the current level for the next iteration.
            currentLevel = nextLevel;
        }

        // When the loop is done, the single remaining hash is the root.
        // Encode it as a hex string for the final, human-readable output.
        return currentLevel[0].toString('hex');

    }

}