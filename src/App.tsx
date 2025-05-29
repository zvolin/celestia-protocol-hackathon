import { useState, useContext } from 'react'
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
  console.log(txClient);

  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_LIST[0]);
  const [placements, setPlacements] = useState<{ x: number, y: number, emoji: string }[]>([]);
  const [lastBlob, setLastBlob] = useState<any>(null);
  const [allBlobs, setAllBlobs] = useState<any[]>([]);
  const [reconstructedPlacements, setReconstructedPlacements] = useState<{ x: number, y: number, emoji: string }[] | null>(null);

  // Handler for placing an emoji
  function handlePlaceEmoji(x: number, y: number) {
    const timestamp = Date.now();
    const placement = { x, y, emoji: selectedEmoji, timestamp };
    setPlacements([...placements, placement]);

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
    setLastBlob(blobObj);
    setAllBlobs(prev => [...prev, blobObj]);
  }

  // Download all blobs as blobs.json
  function downloadBlobs() {
    const json = JSON.stringify(allBlobs, null, 2);
    const blob = new window.Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blobs.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Handle blobs.json upload and reconstruct board state
  function handleBlobsFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const blobs = JSON.parse(text);
        // Extract placements from blobs, use only the latest placement per coordinate
        const coordMap = new Map<string, { x: number, y: number, emoji: string, timestamp: number }>();
        blobs.forEach((blob: any) => {
          const placement = blob.placement;
          if (!placement) return;
          const key = `${placement.x},${placement.y}`;
          if (!coordMap.has(key) || coordMap.get(key)!.timestamp < placement.timestamp) {
            coordMap.set(key, placement);
          }
        });
        setReconstructedPlacements(Array.from(coordMap.values()));
      } catch (err) {
        alert('Failed to parse blobs.json');
      }
    };
    reader.readAsText(file);
  }

  return (
    <main>
      <EmojiPicker emojis={EMOJI_LIST} selected={selectedEmoji} onSelect={setSelectedEmoji} />
      <div className="selected-emoji-display">{selectedEmoji}</div>
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <label htmlFor="blobs-upload" className="upload-blobs-label">Load blobs.json to reconstruct board: </label>
        <input id="blobs-upload" type="file" accept="application/json" onChange={handleBlobsFileUpload} />
      </div>
      <Grid20x20 placements={reconstructedPlacements ?? placements} onPlace={handlePlaceEmoji} />
      <Launcher />
      {lastBlob && (
        <div className="blob-display">
          <h3>Last Created Blob Data</h3>
          <pre>{JSON.stringify(lastBlob, null, 2)}</pre>
        </div>
      )}
      {allBlobs.length > 0 && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button onClick={downloadBlobs} className="download-blobs-btn">Download blobs.json</button>
        </div>
      )}
    </main>
  )
}

export default App

function Launcher() {
  const node = useContext(LuminaContext);

  return (
    <>
      {node ?
        <button
          onClick={async () => {
            let config = NodeConfig.default(Network.Mainnet);
            await node.start(config)
          }}
        >
          Start
        </button>
        :
        <span>Loading...</span>
      }
    </>
  );
}

// 20x20 Grid Component
function Grid20x20({ placements, onPlace }: { placements: { x: number, y: number, emoji: string }[], onPlace: (x: number, y: number) => void }) {
  const size = 20;
  // Build a 2D array for the grid
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  placements.forEach(({ x, y, emoji }) => {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      grid[y][x] = emoji;
    }
  });
  return (
    <div className="emoji-board-grid">
      {Array.from({ length: size * size }).map((_, idx) => {
        const x = idx % size;
        const y = Math.floor(idx / size);
        return (
          <div
            key={idx}
            className="emoji-board-cell"
            onClick={() => onPlace(x, y)}
            style={{ cursor: 'pointer' }}
          >
            {grid[y][x]}
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
