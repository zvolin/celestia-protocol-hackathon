import { useState, useContext, useEffect, useRef } from 'react'
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
  const [lastBlob, setLastBlob] = useState<any>(null);
  const [allBlobs, setAllBlobs] = useState<any[]>([]);
  const [reconstructedPlacements, setReconstructedPlacements] = useState<{ x: number, y: number, emoji: string }[] | null>(null);
  const [loadingReconstruct, setLoadingReconstruct] = useState(false);
  const [nodeStarted, setNodeStarted] = useState(false);
  const [lastPlacedInfo, setLastPlacedInfo] = useState<{ x: number, y: number, emoji: string } | null>(null);
  const [pendingPlacements, setPendingPlacements] = useState<{ x: number, y: number, emoji: string }[]>([]);

  // Ref to track last seen header height for periodic refresh
  const lastSeenHeightRef = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [avoidXRange, setAvoidXRange] = useState<[number, number]>([0, 0]);

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

  // Periodic board refresh: every second, check for new header height and fetch new blobs if needed
  useEffect(() => {
    if (!nodeStarted || !node) return;
    let interval: NodeJS.Timeout;
    interval = setInterval(async () => {
      try {
        const headHeader = await node.requestHeadHeader();
        const latestHeight = Number(headHeader.height());
        if (lastSeenHeightRef.current === null) {
          lastSeenHeightRef.current = latestHeight;
          return;
        }
        if (latestHeight > lastSeenHeightRef.current) {
          console.log("New height:", latestHeight);
          let startHeight = lastSeenHeightRef.current + 1
          lastSeenHeightRef.current = latestHeight;
          // For each unseen height, fetch blobs and update board concurrently
          const ns = Namespace.newV0(new Uint8Array(NAMESPACE));
          const heights: number[] = [];
          for (let h = startHeight; h <= latestHeight; h++) {
            heights.push(h);
          }
          // Fetch all headers concurrently
          console.log('Fetching headers concurrently for heights:', heights);
          const headerPromises = heights.map(h => node.requestHeaderByHeight(BigInt(h)).catch(e => null));
          const headers = await Promise.all(headerPromises);
          console.log('Fetched headers:', headers);
          // Fetch all blobs concurrently for valid headers
          console.log('Fetching blobs concurrently for valid headers...');
          const blobPromises = headers.map((header, idx) => {
            if (!header) return Promise.resolve([]);
            console.log(`Requesting all blobs for header at height: ${heights[idx]}; header: ${header}`);
            return node.requestAllBlobs(header, ns, 10).catch(e => []);
          });
          const blobsArrays = await Promise.all(blobPromises);
          console.log('Fetched blobs arrays:', blobsArrays);
          // Process blobs for each height
          blobsArrays.forEach((blobs, idx) => {
            const h = heights[idx];
            console.log("Processing blobs at height:", h);
            if (blobs.length === 0) {
              console.log("No blobs found at height:", h);
              return;
            }
            console.log("Found blobs at height:", h, blobs.length);
            for (const blob of blobs) {
              try {
                console.log(`Decoding blob data for blob at height ${h}:`, blob);
                const data = new TextDecoder().decode(blob.data);
                console.log(`Decoded data at height ${h}:`, data);
                console.log(`Parsing JSON data for placement at height ${h}`);
                const placement = JSON.parse(data);
                console.log(`Parsed placement at height ${h}:`, placement);
                setReconstructedPlacements(prev => {
                  const safePrev = prev ?? [];
                  const filtered = safePrev.filter(p => !(p.x === placement.x && p.y === placement.y));
                  return [...filtered, { x: placement.x, y: placement.y, emoji: placement.emoji }];
                });
              } catch (e) {
                // Ignore parse errors
                console.warn(`Failed to parse blob at height ${h}`);
              }
            }
          });
        }
      } catch (e) {
        // Ignore errors
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [nodeStarted, node]);

  // Measure the board's x-range after mount and on resize
  useEffect(() => {
    function updateRange() {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        setAvoidXRange([rect.left, rect.right]);
      }
    }
    updateRange();
    window.addEventListener('resize', updateRange);
    return () => window.removeEventListener('resize', updateRange);
  }, []);

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
    const blobObj = {
      ns,
      data: Array.from(data),
      version: AppVersion.latest(),
      placement
    };

    // Submit blob using txClient
    if (txClient) {
      try {
        const txInfo = await txClient.submitBlobs([blob]);
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", txInfo);
        // Only update frontend if transaction is successful
        console.log(`Placing emoji at (${x}, ${y}):`, selectedEmoji);
        setPlacements(prev => [...prev, placement]);
        setLastBlob(blobObj);
        setLastPlacedInfo({ x, y, emoji: selectedEmoji });
        setAllBlobs(prev => [...prev, blobObj]);
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
      const blobsCache = getBlobsCache();
      const heights: number[] = [];
      for (let h = latestHeight; h >= startHeight; h--) {
        heights.push(h);
      }
      // First, check cache and build fetch lists
      const uncachedHeights: number[] = [];
      heights.forEach(h => {
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
        } else {
          uncachedHeights.push(h);
        }
      });
      // Fetch all headers concurrently for uncached heights
      console.log('Fetching headers concurrently for uncached heights:', uncachedHeights);
      const headerPromises = uncachedHeights.map(h => node.requestHeaderByHeight(BigInt(h)).catch(e => null));
      const headers = await Promise.all(headerPromises);
      console.log('Fetched headers:', headers);
      // Fetch all blobs concurrently for valid headers
      console.log('Fetching blobs concurrently for valid headers...');
      const blobPromises = headers.map((header, idx) => {
        if (!header) return Promise.resolve([]);
        console.log(`Requesting all blobs for header at height: ${uncachedHeights[idx]}, namespace:`, ns);
        return node.requestAllBlobs(header, ns, 10).catch(e => []);
      });
      const blobsArrays = await Promise.all(blobPromises);
      console.log('Fetched blobs arrays:', blobsArrays);
      // Process blobs for each uncached height
      blobsArrays.forEach((blobs, idx) => {
        const h = uncachedHeights[idx];
        blobsCache[h] = [];
        if (blobs.length === 0) {
          return;
        }
        for (const blob of blobs) {
          try {
            console.log(`Decoding blob data for blob at height ${h}:`, blob);
            const data = new TextDecoder().decode(blob.data);
            console.log(`Decoded data at height ${h}:`, data);
            console.log(`Parsing JSON data for placement at height ${h}`);
            const placement = JSON.parse(data);
            console.log(`Retrieved placement from node at height ${h}, time ${headers[idx]?.header?.time}:`, placement);
            setReconstructedPlacements(prev => {
              const safePrev = prev ?? [];
              const filtered = safePrev.filter(p => !(p.x === placement.x && p.y === placement.y));
              return [...filtered, { x: placement.x, y: placement.y, emoji: placement.emoji }];
            });
            allBlobs.push({ placement, height: h, time: headers[idx]?.header?.time });
            blobsCache[h].push({ data, time: headers[idx]?.header?.time });
          } catch (e) {
            // Ignore parse errors
            console.warn(`Failed to parse blob at height ${h}`);
          }
        }
      });
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
    <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', zIndex: 1 }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: '2.8rem',
        fontWeight: 800,
        letterSpacing: '0.05em',
        margin: '2rem 0 1.5rem 0',
        color: '#6c47ff',
        textShadow: '0 2px 16px #e0d6ff, 0 1px 0 #000',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}>
        Celestia Vibes
      </h1>
      <FallingEmojisBackground emojis={EMOJI_LIST} avoidXRange={avoidXRange} />
      <div ref={boardRef}>
        <Grid20x20 placements={reconstructedPlacements ?? placements} onPlace={handlePlaceEmoji} pendingPlacements={pendingPlacements} />
      </div>
      <EmojiPicker emojis={EMOJI_LIST} selected={selectedEmoji} onSelect={setSelectedEmoji} />
      <div className="selected-emoji-display">{selectedEmoji}</div>
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

// Add a new FallingEmojisBackground component
function FallingEmojisBackground({ emojis, avoidXRange }: { emojis: string[], avoidXRange?: [number, number] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const emojiCount = 80;
  const emojiObjs = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function randomEmoji() {
      return emojis[Math.floor(Math.random() * emojis.length)];
    }
    function randomX() {
      let x;
      let tries = 0;
      do {
        x = Math.random() * width;
        tries++;
      } while (
        avoidXRange && avoidXRange[1] > avoidXRange[0] && x >= avoidXRange[0] && x <= avoidXRange[1] && tries < 10
      );
      return x;
    }
    function randomSpeed() {
      return 1 + Math.random() * 2;
    }
    function randomFontSize() {
      return 24 + Math.random() * 32;
    }
    // Initialize emoji objects
    emojiObjs.current = Array.from({ length: emojiCount }).map(() => ({
      emoji: randomEmoji(),
      x: randomX(),
      y: Math.random() * height,
      speed: randomSpeed(),
      fontSize: randomFontSize(),
      opacity: 0.7 + Math.random() * 0.3,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const obj of emojiObjs.current) {
        ctx.globalAlpha = obj.opacity;
        ctx.font = `${obj.fontSize}px serif`;
        ctx.fillText(obj.emoji, obj.x, obj.y);
        obj.y += obj.speed;
        if (obj.y > height + 40) {
          obj.emoji = randomEmoji();
          obj.x = randomX();
          obj.y = -40;
          obj.speed = randomSpeed();
          obj.fontSize = randomFontSize();
          obj.opacity = 0.7 + Math.random() * 0.3;
        }
      }
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [emojis, avoidXRange]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
