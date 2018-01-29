import nacl from 'tweetnacl'

function Random() {
}

/* secure random bytes that sometimes throws an error due to lack of entropy */
Random.getRandomBuffer = nacl.randomBytes;

module.exports = Random;
