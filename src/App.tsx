import { useState, useEffect, useContext } from 'react'
import { LuminaContext, LuminaContextProvider } from './Lumina.tsx'
import { Network, NodeConfig, PeerTrackerInfoSnapshot, SyncingInfoSnapshot } from 'lumina-node'
import './App.css'

// A large subset of common emojis (can be expanded as needed)
const EMOJI_LIST = [
  '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','🥰','😗','😙','😚','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🥴','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐','🤓','😈','👿','👹','👺','💀','👻','👽','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','🐵','🐒','🦍','🦧','🐶','🐕','🦮','🐕‍🦺','🐩','🐺','🦊','🦝','🐱','🐈','🐈‍⬛','🦁','🐯','🐅','🐆','🐴','🐎','🦄','🦓','🦌','🐮','🐂','🐃','🐄','🐷','🐖','🐗','🐽','🐏','🐑','🐐','🐪','🐫','🦙','🦒','🐘','🦏','🦛','🐭','🐁','🐀','🐹','🐰','🐇','🐿️','🦔','🦇','🐻','🐨','🐼','🦥','🦦','🦨','🦘','🦡','🐾','🦃','🐔','🐓','🐣','🐤','🐥','🐦','🐧','🕊️','🦅','🦆','🦢','🦉','🦩','🦚','🦜','🐸','🐊','🐢','🦎','🐍','🐲','🐉','🦕','🦖','🐳','🐋','🐬','🦭','🐟','🐠','🐡','🦈','🐙','🦑','🦐','🦞','🦀','🐚','🦧','🦮','🦥','🦦','🦨','🦩','🦪','🦫','🦭','🦮','🦯','🦴','🦵','🦶','🦷','🦸','🦹','🦺','🦻','🦼','🦽','🦾','🦿','🧀','🍕','🍔','🍟','🌭','🍿','🥓','🥩','🍗','🍖','🦴','🥚','🍳','🥞','🧇','🥯','🥨','🥐','🍞','🥖','🥪','🥙','🧆','🥗','🥘','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','☕','🍵','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾','🥄','🍴','🍽️','🥣','🥡','🥢','🧂','⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥏','🎱','🏓','🏸','🥅','🏒','🏑','🏏','🥍','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','⛹️','🤺','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🤹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','🧞‍♂️','🧞‍♀️','🧟‍♂️','🧟‍♀️','💌','💘','💝','💖','💗','💓','💞','💕','💟','❣️','💔','❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💯','💢','💥','💫','💦','💨','🕳️','💣','💬','👁️‍🗨️','🗨️','🗯️','💭','💤','👋','🤚','🖐️','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','🧠','🦷','🦴','👀','👁️','👅','👄','💋','🩸','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','🧑‍⚕️','🧑‍🎓','🧑‍🏫','🧑‍⚖️','🧑‍🌾','🧑‍🍳','🧑‍🔧','🧑‍🏭','🧑‍💼','🧑‍🔬','🧑‍💻','🧑‍🎤','🧑‍🎨','🧑‍✈️','🧑‍🚀','🧑‍🚒','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🤱','👩‍🍼','🧑‍🍼','👼','🎅','🤶','🧑‍🎄','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','🦸‍♂️','🦸‍♀️','🦹‍♂️','🦹‍♀️','🧙‍♂️','🧙‍♀️','🧚‍♂️','🧚‍♀️','🧛‍♂️','🧛‍♀️','🧜‍♂️','🧜‍♀️','🧝‍♂️','🧝‍♀️','🧞‍♂️','🧞‍♀️','🧟‍♂️','🧟‍♀️','💏','💑','👪','👨‍👩‍👦','👨‍👩‍👧','👨‍👩‍👧‍👦','👨‍👩‍👦‍👦','👨‍👩‍👧‍👧','👩‍👩‍👦','👩‍👩‍👧','👩‍👩‍👧‍👦','👩‍👩‍👦‍👦','👩‍👩‍👧‍👧','👨‍👨‍👦','👨‍👨‍👧','👨‍👨‍👧‍👦','👨‍👨‍👦‍👦','👨‍👨‍👧‍👧','👩‍❤️‍👨','👩‍❤️‍👩','👨‍❤️‍👨','💋','💌','💘','💝','💖','💗','💓','💞','💕','💟','❣️','💔','❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💯','💢','💥','💫','💦','💨','🕳️','💣','💬','👁️‍🗨️','🗨️','🗯️','💭','💤','👋','🤚','🖐️','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','🧠','🦷','🦴','👀','👁️','👅','👄','💋','🩸','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','🧑‍⚕️','🧑‍🎓','🧑‍🏫','🧑‍⚖️','🧑‍🌾','🧑‍🍳','🧑‍🔧','🧑‍🏭','🧑‍💼','🧑‍🔬','🧑‍💻','🧑‍🎤','🧑‍🎨','🧑‍✈️','🧑‍🚀','🧑‍🚒','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🤱','👩‍🍼','🧑‍🍼','👼','🎅','🤶','🧑‍🎄'];

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_LIST[0]);
  return (
    <LuminaContextProvider>
      <main>
        <EmojiDropdown emojis={EMOJI_LIST} selected={selectedEmoji} onSelect={setSelectedEmoji} />
        <div className="selected-emoji-display">{selectedEmoji}</div>
        <Grid20x20 />
        <Launcher />
        <Stats />
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
function Grid20x20() {
  const size = 20;
  return (
    <div className="emoji-board-grid">
      {Array.from({ length: size * size }).map((_, idx) => (
        <div key={idx} className="emoji-board-cell"></div>
      ))}
    </div>
  );
}

// Emoji Dropdown Component
function EmojiDropdown({ emojis, selected, onSelect }: { emojis: string[], selected: string, onSelect: (e: string) => void }) {
  return (
    <div className="emoji-dropdown">
      <label htmlFor="emoji-select">Choose an emoji: </label>
      <select
        id="emoji-select"
        value={selected}
        onChange={e => onSelect(e.target.value)}
        className="emoji-dropdown-select"
      >
        {emojis.map((emoji) => (
          <option key={emoji} value={emoji}>{emoji}</option>
        ))}
      </select>
    </div>
  );
}
