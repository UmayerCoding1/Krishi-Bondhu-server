import crypto from 'crypto';

function createHashPassword(password: string) {
    const slug = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, slug, 100000, 64, 'sha256');
    return { slug, hash: hash.toString('hex') };
};

function verifyHashPassword(password: string, slug: string, hash: string) {
    const hashVerify = crypto.pbkdf2Sync(password, slug, 100000, 64, 'sha256');

    return hashVerify.toString('hex') === hash;
};

export { createHashPassword, verifyHashPassword };