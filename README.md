# Text2QR Desktop

Offline desktop application for text encryption and QR code tools. Built with Electron, React, and TypeScript.

## Features

- **Text to QR** — Encrypt text with a password and generate a QR code
- **QR to Text** — Upload a QR code image and decrypt it with the password
- **Encrypt Text** — Convert plain text to an encrypted string using AES-256
- **Decrypt Text** — Restore encrypted text to its original form

All operations are performed **entirely offline** — no internet connection required.

## Download

Download the latest installer from the [Releases](https://github.com/alexvirtech/Text2qrD/releases) page.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build:win
```

## Encryption

Uses AES-256-CBC encryption via CryptoJS with deterministic key derivation (EVP-KDF + SHA256 salt). Fully compatible with the [text2qr.com](https://text2qr.com) web version.

## License

MIT
