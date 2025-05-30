import { useState, useContext, useEffect } from 'react'
import { AppVersion, Blob, Namespace, Network, NodeConfig } from 'lumina-node'
import { LeapClientContext } from './LeapClient.tsx'
import { LuminaContext } from './Lumina.tsx'
import './App.css'

// A large subset of common emojis (can be expanded as needed)
const EMOJI_LIST = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🥴', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦔', '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐚', '🦧', '🦮', '🦥', '🦦', '🦨', '🦩', '🦪', '🦫', '🦭', '🦮', '🦯', '🦴', '🦵', '🦶', '🦷', '🦸', '🦹', '🦺', '🦻', '🦼', '🦽', '🦾', '🦿', '🧀', '🍕', '🍔', '🍟', '🌭', '🍿', '🥓', '🥩', '🍗', '🍖', '🦴', '🥚', '🍳', '🥞', '🧇', '🥯', '🥨', '🥐', '🍞', '🥖', '🥪', '🥙', '🧆', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏', '🥍', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🧞‍♂️', '🧞‍♀️', '🧟‍♂️', '🧟‍♀️', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '🧑‍⚕️', '🧑‍🎓', '🧑‍🏫', '🧑‍⚖️', '🧑‍🌾', '🧑‍🍳', '🧑‍🔧', '🧑‍🏭', '🧑‍💼', '🧑‍🔬', '🧑‍💻', '🧑‍🎤', '🧑‍🎨', '🧑‍✈️', '🧑‍🚀', '🧑‍🚒', '👮', '🕵️', '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👩‍🍼', '🧑‍🍼', '👼', '🎅', '🤶', '🧑‍🎄'];

// Hardcoded namespace for the project
const NAMESPACE = [97, 98, 99, 100, 101, 102, 103, 104]; // 8 bytes, example

function App() {
  const txClient = useContext(LeapClientContext);
  const node = useContext(LuminaContext);
  console.log(txClient);

  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_LIST[0]);
  const [placements, setPlacements] = useState<{ x: number, y: number, emoji: string }[]>([]);
  const [reconstructedPlacements, setReconstructedPlacements] = useState<{ x: number, y: number, emoji: string }[] | null>(null);
  const [_, setLoadingReconstruct] = useState(false);
  const [nodeStarted, setNodeStarted] = useState(false);
  const [lastPlacedInfo, setLastPlacedInfo] = useState<{ x: number, y: number, emoji: string } | null>(null);
  const [pendingPlacements, setPendingPlacements] = useState<{ x: number, y: number, emoji: string }[]>([]);

  // Automatically start the node on mount
  useEffect(() => {
    if (!node) return;
    let config = NodeConfig.default(Network.Mocha);
    config.bootnodes = [
      "/dnsaddr/mocha-boot.pops.one/p2p/12D3KooWDzNyDSvTBdKQAmnsUdAyQCQWwM3ReXTmPaaf6LzfNwRs",
      "/dnsaddr/celestia-mocha.qubelabs.io/p2p/12D3KooWQVmHy7JpfxpKZfLjvn12GjvMgKrWdsHkFbV2kKqQFBCG",
      "/dnsaddr/celestia-mocha4-bootstrapper.binary.builders/p2p/12D3KooWK6AYaPSe2EP99NP5G2DKwWLfMi6zHMYdD65KRJwdJSVU",
      "/dnsaddr/celestia-testnet-boot.01node.com/p2p/12D3KooWR923Tc8SCzweyaGZ5VU2ahyS9VWrQ8mDz56RbHjHFdzW",
      "/dnsaddr/celestia-mocha-boot.zkv.xyz/p2p/12D3KooWFdkhm7Ac6nqNkdNiW2g16KmLyyQrqXMQeijdkwrHqQ9J",
    ];
    node.start(config).then(() => {
      setNodeStarted(true);
      console.log('Node started');
    });
  }, [node]);

  // Automatically reconstruct the board after node is started
  useEffect(() => {
    if (nodeStarted) {
      setTimeout(() => {
        reconstructBoardFromCelestia();
      }, 1000); // 1 second delay
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeStarted]);

  // Handler for placing an emoji
  async function handlePlaceEmoji(x: number, y: number) {
    const timestamp = Date.now();
    const placement = { x, y, emoji: selectedEmoji, timestamp };

    // Optimistically add a lighter emoji
    setPendingPlacements(prev => [...prev, { x, y, emoji: selectedEmoji }]);

    // Serialize placement as JSON and encode as Uint8Array
    const dataStr = JSON.stringify(placement);
    const data = new TextEncoder().encode(dataStr);
    const ns = Namespace.newV0(new Uint8Array(NAMESPACE));
    const blob = new Blob(ns, data, AppVersion.latest());
    console.log(blob);

    // Submit blob using txClient
    if (txClient) {
      try {
        const txInfo = await txClient.submitBlobs([blob]);
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", txInfo);
        // Only update frontend if transaction is successful
        console.log(`Placing emoji at (${x}, ${y}):`, selectedEmoji);
        setPlacements(prev => [...prev, placement]);
        setLastPlacedInfo({ x, y, emoji: selectedEmoji });
        // Also update reconstructedPlacements if it is not null
        setReconstructedPlacements(prev => {
          if (prev === null) return prev;
          const filtered = prev.filter(p => !(p.x === x && p.y === y));
          return [...filtered, { x, y, emoji: selectedEmoji }];
        });
        // Remove pending placement
        setPendingPlacements(prev => prev.filter(p => !(p.x === x && p.y === y)));
      } catch (err) {
        console.error("Failed to submit blob:", err);
        // Remove pending placement on failure
        setPendingPlacements(prev => prev.filter(p => !(p.x === x && p.y === y)));
      }
    } else {
      console.warn("txClient is not initialized");
      // Remove pending placement if txClient is not initialized
      setPendingPlacements(prev => prev.filter(p => !(p.x === x && p.y === y)));
    }
  }

  // Utility to get and set blobs cache in localStorage
  function getBlobsCache() {
    try {
      const cache = localStorage.getItem('celestiaBlobsCache');
      return cache ? JSON.parse(cache) : {};
    } catch {
      return {};
    }
  }
  function setBlobsCache(cache: any) {
    localStorage.setItem('celestiaBlobsCache', JSON.stringify(cache));
  }

  // Fetch and reconstruct board state from Celestia for the last 10 minutes
  async function reconstructBoardFromCelestia() {
    if (!node) {
      alert('Node not initialized');
      return;
    }
    setLoadingReconstruct(true);
    try {
      console.log('--- Starting board reconstruction from Celestia ---');
      // 1. Get latest header
      const headHeader = await node.requestHeadHeader();
      const latestHeight = Number(headHeader.height());
      console.log(`Latest height: ${latestHeight}`);
      const latestTime = new Date(headHeader.header.time).getTime();

      // 2. Estimate block time (fallback to 6s if not available)
      let avgBlockTimeMs = 6000;
      if (latestHeight > 2) {
        const prevHeader = await node.requestHeaderByHeight(BigInt(latestHeight - 1));
        const prevTime = new Date(prevHeader.header.time).getTime();
        avgBlockTimeMs = Math.abs(latestTime - prevTime) || 6000;
      }
      console.log(`Estimated average block time: ${avgBlockTimeMs} ms`);

      // 3. Compute height 1 minute ago
      const msInWindow = 60 * 1000; // 1 minute
      const blocksInWindow = Math.ceil(msInWindow / avgBlockTimeMs);
      const startHeight = Math.max(1, latestHeight - blocksInWindow);
      console.log(`Reconstructing from height ${startHeight} to ${latestHeight}`);

      // 4. Fetch blobs for each block in range (concurrently)
      const ns = Namespace.newV0(new Uint8Array(NAMESPACE));
      let allBlobs: any[] = [];
      const fetchPromises = [];
      const blobsCache = getBlobsCache();
      for (let h = latestHeight; h >= startHeight; h--) {
        if (blobsCache[h]) {
          // Use cached blobs for this height
          console.log(`Using cached blobs for height ${h}`);
          for (const cached of blobsCache[h]) {
            try {
              const placement = JSON.parse(cached.data);
              setReconstructedPlacements(prev => {
                const safePrev = prev ?? [];
                const filtered = safePrev.filter(p => !(p.x === placement.x && p.y === placement.y));
                return [...filtered, { x: placement.x, y: placement.y, emoji: placement.emoji }];
              });
              allBlobs.push({ placement, height: h, time: cached.time });
            } catch (e) {
              console.warn(`Failed to parse cached blob at height ${h}`);
            }
          }
          continue;
        }
        fetchPromises.push((async () => {
          try {
            console.log(`Requesting header for height: ${h}`);
            const header = await node.requestHeaderByHeight(BigInt(h));
            console.log(`Requesting all blobs for height: ${h}, namespace:`, ns);
            const blobs = await node.requestAllBlobs(header, ns, 10); // 10s timeout
            console.log(`Found ${blobs.length} blobs at height ${h}`);
            blobsCache[h] = [];
            for (const blob of blobs) {
              try {
                const data = new TextDecoder().decode(blob.data);
                const placement = JSON.parse(data);
                console.log(`Retrieved placement from node at height ${h}, time ${header.header.time}:`, placement);
                setReconstructedPlacements(prev => {
                  const safePrev = prev ?? [];
                  const filtered = safePrev.filter(p => !(p.x === placement.x && p.y === placement.y));
                  return [...filtered, { x: placement.x, y: placement.y, emoji: placement.emoji }];
                });
                allBlobs.push({ placement, height: h, time: header.header.time });
                blobsCache[h].push({ data, time: header.header.time });
              } catch (e) {
                // Ignore parse errors
                console.warn(`Failed to parse blob at height ${h}`);
              }
            }
          } catch (e) {
            // Ignore missing blocks
            console.warn(`Failed to fetch header or blobs at height ${h}`);
          }
        })());
      }
      await Promise.all(fetchPromises);
      setBlobsCache(blobsCache);

      // 5. Aggregate placements: latest per coordinate wins
      const coordMap = new Map<string, { x: number, y: number, emoji: string, timestamp: number }>();
      allBlobs.forEach((blob: any) => {
        const placement = blob.placement;
        if (!placement) return;
        const key = `${placement.x},${placement.y}`;
        if (!coordMap.has(key) || coordMap.get(key)!.timestamp < placement.timestamp) {
          coordMap.set(key, placement);
        }
      });
      console.log(`Aggregated placements for ${coordMap.size} unique coordinates.`);
      setReconstructedPlacements(Array.from(coordMap.values()));
      console.log('Board reconstructed from Celestia!');
      console.log('--- Finished board reconstruction from Celestia ---');
    } catch (err) {
      alert('Failed to reconstruct board from Celestia: ' + err);
    } finally {
      setLoadingReconstruct(false);
    }
  }

  return (
    <main>
      <EmojiPicker emojis={EMOJI_LIST} selected={selectedEmoji} onSelect={setSelectedEmoji} />
      <div className="selected-emoji-display">{selectedEmoji}</div>
      <Grid20x20 placements={reconstructedPlacements ?? placements} onPlace={handlePlaceEmoji} pendingPlacements={pendingPlacements} />
      {lastPlacedInfo && (
        <div style={{ textAlign: 'center', margin: '2rem 0', fontSize: '1.2rem' }}>
          <strong>Last placed:</strong> {lastPlacedInfo.emoji} at ({lastPlacedInfo.x}, {lastPlacedInfo.y})
        </div>
      )}
    </main>
  )
}

export default App

// 20x20 Grid Component
function Grid20x20({ placements, onPlace, pendingPlacements = [] }: { placements: { x: number, y: number, emoji: string }[], onPlace: (x: number, y: number) => void, pendingPlacements?: { x: number, y: number, emoji: string }[] }) {
  const size = 20;
  // Build a 2D array for the grid
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  placements.forEach(({ x, y, emoji }) => {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      grid[y][x] = emoji;
    }
  });
  // Track pending placements separately
  const pendingMap = new Map<string, string>();
  pendingPlacements.forEach(({ x, y, emoji }) => {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      pendingMap.set(`${x},${y}`, emoji);
    }
  });
  return (
    <div className="emoji-board-grid">
      {Array.from({ length: size * size }).map((_, idx) => {
        const x = idx % size;
        const y = Math.floor(idx / size);
        const pendingEmoji = pendingMap.get(`${x},${y}`);
        return (
          <div
            key={idx}
            className="emoji-board-cell"
            onClick={() => onPlace(x, y)}
            style={{ cursor: 'pointer', opacity: pendingEmoji ? 0.5 : 1 }}
          >
            {pendingEmoji ? pendingEmoji : grid[y][x]}
          </div>
        );
      })}
    </div>
  );
}

// Emoji Picker Component with Pagination
function EmojiPicker({ emojis, selected, onSelect }: { emojis: string[], selected: string, onSelect: (e: string) => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const emojisPerPage = 20;
  const totalPages = Math.ceil(emojis.length / emojisPerPage);

  const startIndex = currentPage * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const currentEmojis = emojis.slice(startIndex, endIndex);

  return (
    <div className="emoji-picker">
      <div className="emoji-grid">
        {currentEmojis.map((emoji) => (
          <button
            key={emoji}
            className={`emoji-picker-btn ${selected === emoji ? 'selected' : ''}`}
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="emoji-pagination">
        <button
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
