import { useState, useEffect, useContext } from 'react'
import { LuminaContext, LuminaContextProvider } from './Lumina.tsx'
import { Network, NodeConfig, PeerTrackerInfoSnapshot, SyncingInfoSnapshot } from 'lumina-node'
import './App.css'

// A large subset of common emojis (can be expanded as needed)
const EMOJI_LIST = [
  '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','🥰','😗','😙','😚','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🥴','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐','🤓','😈','👿','👹','👺','💀','👻','👽','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','🐵','🐒','🦍','🦧','🐶','🐕','🦮','🐕‍🦺','🐩','🐺','🦊','🦝','🐱','🐈','🐈‍⬛','🦁','🐯','🐅','🐆','🐴','🐎','🦄','🦓','🦌','🐮','🐂','🐃','🐄','🐷','🐖','🐗','🐽','🐏','🐑','🐐','🐪','🐫','🦙','🦒','🐘','🦏','🦛','🐭','🐁','🐀','🐹','🐰','🐇','🐿️','🦔','🦇','🐻','🐨','🐼','🦥','🦦','🦨','🦘','🦡','🐾','🦃','🐔','🐓','🐣','🐤','🐥','🐦','🐧','🕊️','🦅','🦆','🦢','🦉','🦩','🦚','🦜','🐸','🐊','🐢','🦎','🐍','🐲','🐉','🦕','🦖','🐳','🐋','🐬','🦭','🐟','🐠','🐡','🦈','🐙','🦑','🦐','🦞','🦀','🐚','🦧','🦮','🦥','🦦','🦨','🦩','🦪','🦫','🦭','🦮','🦯','🦴','🦵','🦶','🦷','🦸','🦹','🦺','🦻','🦼','🦽','🦾','🦿','🧀','🍕','🍔','🍟','🌭','🍿','🥓','🥩','🍗','🍖','🦴','🥚','🍳','🥞','🧇','🥯','🥨','🥐','🍞','🥖','🥪','🥙','🧆','🥗','🥘','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','☕','🍵','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾','🥄','🍴','🍽️','🥣','🥡','🥢','🧂','⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥏','🎱','🏓','🏸','🥅','🏒','🏑','🏏','🥍','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','⛹️','🤺','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🤹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','🧞‍♂️','🧞‍♀️','🧟‍♂️','🧟‍♀️','💌','💘','💝','💖','💗','💓','💞','💕','💟','❣️','💔','❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💯','💢','💥','💫','💦','💨','🕳️','💣','💬','👁️‍🗨️','🗨️','🗯️','💭','💤','👋','🤚','🖐️','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','🧠','🦷','🦴','👀','👁️','👅','👄','💋','🩸','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','🧑‍⚕️','🧑‍🎓','🧑‍🏫','🧑‍⚖️','🧑‍🌾','🧑‍🍳','🧑‍🔧','🧑‍🏭','🧑‍💼','🧑‍🔬','🧑‍💻','🧑‍🎤','🧑‍🎨','🧑‍✈️','🧑‍🚀','🧑‍🚒','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🤱','👩‍🍼','🧑‍🍼','👼','🎅','🤶','🧑‍🎄'];

// Hardcoded namespace for the project
const NAMESPACE = [97, 98, 99, 100, 101, 102, 103, 104]; // 8 bytes, example

// Dummy Blob and Namespace classes for demonstration (replace with actual Celestia SDK in production)
class Namespace {
  static newV0(arr: Uint8Array) {
    return { version: 0, id: Array.from(arr) };
  }
}
class AppVersion {
  static latest() {
    return 1;
  }
}
class Blob {
  public ns: any;
  public data: Uint8Array;
  public version: number;
  constructor(ns: any, data: Uint8Array, version: number) {
    this.ns = ns;
    this.data = data;
    this.version = version;
  }
}

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_LIST[0]);
  const [placements, setPlacements] = useState<{ x: number, y: number, emoji: string }[]>([]);
  const [lastBlob, setLastBlob] = useState<any>(null);

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
    setLastBlob({
      ns,
      data: Array.from(data),
      version: AppVersion.latest(),
      placement
    });
  }

  return (
    <LuminaContextProvider>
      <main>
        <EmojiPicker emojis={EMOJI_LIST} selected={selectedEmoji} onSelect={setSelectedEmoji} />
        <div className="selected-emoji-display">{selectedEmoji}</div>
        <Grid20x20 placements={placements} onPlace={handlePlaceEmoji} />
        <Launcher />
        <Stats />
        {lastBlob && (
          <div className="blob-display">
            <h3>Last Created Blob Data</h3>
            <pre>{JSON.stringify(lastBlob, null, 2)}</pre>
          </div>
        )}
      </main>
    </LuminaContextProvider>
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

function Stats() {
  const node = useContext(LuminaContext);

  const [peerTrackerInfo, setPeerTrackerInfo] = useState<PeerTrackerInfoSnapshot | null>();
  const [syncerInfo, setSyncerInfo] = useState<SyncingInfoSnapshot | null>();

  useEffect(() => {
    const interval = setInterval(() => {
      const update = async () => {
        if (node && await node.isRunning()) {
          setPeerTrackerInfo(await node.peerTrackerInfo());
          setSyncerInfo(await node.syncerInfo());
        }
      };
      update();
    }, 1000);
    return () => clearInterval(interval);
  }, [node]);

  if (!peerTrackerInfo || !syncerInfo) {
    return;
  }

  return (
    <div>
      <div>network head: {syncerInfo.subjective_head.toString()}</div>
      <div>
        stored headers:
        {syncerInfo.stored_headers.map((range) => {
          return ` ${range.start}..${range.end}`;
        })}
      </div>
      <div>
        peers: {peerTrackerInfo.num_connected_peers.toString()} (
        {peerTrackerInfo.num_connected_trusted_peers.toString()} trusted)
      </div>
    </div>
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
