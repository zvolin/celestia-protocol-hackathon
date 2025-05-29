# Emoji Board

## Project Overview
Emoji Board is a decentralized collaborative board built on Celestia. Users can select an emoji and place it on a 20x20 grid. Each placement sends a PayForBlob transaction to Celestia, storing the emoji, its coordinates, and a timestamp in a hardcoded namespace. Any node can reconstruct the board by reading all transactions in the namespace from the last 7 days.

---

## Architecture
- **Frontend**: React (Vite) app with a 20x20 grid UI, emoji picker, and wallet integration.
- **Backend/Node**: No centralized backend. Board state is reconstructed by querying Celestia for blobs in the namespace.
- **Celestia**: Used for data availability and ordering via PayForBlob transactions.

---

## Components & Milestones

### 1. Namespace & Data Format
- [ ] Hardcode a namespace ID for the project.
- [ ] Define the data structure for a placement (e.g., `{x, y, emoji, timestamp, sender}`) and serialization format (e.g., JSON or binary).

### 2. Frontend
- [x] 20x20 grid display.
- [x] Emoji picker UI.
- [ ] Click-to-place emoji on grid.
- [ ] Wallet integration for signing and sending PayForBlob transactions.
- [ ] Board state reconstruction logic (fetch and parse blobs from Celestia for the namespace, last 7 days).
- [ ] Real-time or periodic board refresh.

### 3. Celestia Integration
- [ ] Integrate with Celestia light node or RPC for submitting PayForBlob transactions.
- [ ] Query blobs by namespace and time window.
- [ ] Parse and aggregate placements to reconstruct board state (latest placement per coordinate wins).

### 4. Node/Sync Logic
- [ ] On load, fetch all blobs in the namespace from the last 7 days.
- [ ] For each coordinate, use the most recent placement.
- [ ] Display reconstructed board.

### 5. Testing & Deployment
- [ ] Unit and integration tests for serialization, board logic, and Celestia integration.
- [ ] Deploy frontend (e.g., Vercel, Netlify).
- [ ] Document setup and usage in README.

---

## Stretch Goals
- [ ] User avatars or signatures.
- [ ] Board history/timelapse.
- [ ] Rate limiting or anti-spam.
- [ ] Mobile UI improvements.

---

## References
- [Celestia Docs](https://docs.celestia.org/)
- [PayForBlob Spec](https://docs.celestia.org/nodes/submit-blob)
- [Emoji Picker Libraries]