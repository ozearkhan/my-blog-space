

// Utility to encode strings to ArrayBuffer
function encodeToArrayBuffer(data: string): ArrayBuffer {
    return new TextEncoder().encode(data);
}

// Utility to generate random salt
async function generateSalt(length: number = 16): Promise<ArrayBuffer> {
    const salt = new Uint8Array(length);
    crypto.getRandomValues(salt); // cryptographically secure random salt
    return salt.buffer;
}

// Utility to hash the password using PBKDF2
async function hashPassword(password: string, salt: ArrayBuffer): Promise<ArrayBuffer> {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encodeToArrayBuffer(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000, // high iteration count for security
            hash: 'SHA-256' // hash function used for deriving the key
        },
        keyMaterial,
        256 // desired key length in bits
    );
}






export { encodeToArrayBuffer, generateSalt , hashPassword};