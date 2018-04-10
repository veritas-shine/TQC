[![Snyk Vulnerability Analysis](https://snyk.io/test/github/veritas-shine/TQC/badge.svg)](https://snyk.io/test/github/veritas-shine/TQC)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/veritas-shine/TQC/master/LICENSE)

# TQC - Truly Quantum Cash 

> NodeJS-based blockchain cryptocurrency utilizing Ring-LWE type signature scheme ([GLYPH](https://github.com/veritas-shine/glyph-js)) instead of ECDSA. Using simple Proof-of-work algorithm(mixed sha256 & cube256).
>
> GLYPH signature scheme is quantum computer resistant, with fast speed & smallest binary size compared to other post-quantum signature scheme(such as
> XMSS, BLISS-II).

More information:
 * [Post-Quantum Signature](https://en.wikipedia.org/wiki/Post-quantum_cryptography)
 * [GLYPH](http://emsec.rub.de/media/sh/veroeffentlichungen/2014/06/12/lattice_signature.pdf)
 * [Website](https://tqc.cash)
 
* * *

# TQC Testnet (working on)

You are welcome to install the development version and join the testnet. Be aware that work is in progress and there might be frequent breaking changes. 

## Install 
```bash
# clone the latest source code
git clone --depth=1 https://github.com/veritas-shine/TQC.git

# install npm packages
cd TQC && npm i

# run code in develop mode
npm run dev
```
