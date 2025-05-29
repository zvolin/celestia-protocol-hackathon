import { useState, useEffect, useContext } from 'react'
import { LuminaContext, LuminaContextProvider } from './Lumina.tsx'
import { Network, NodeConfig, PeerTrackerInfoSnapshot, SyncingInfoSnapshot } from 'lumina-node'
import './App.css'

function App() {
  return (
    <LuminaContextProvider>
      <main>
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
            let config = NodeConfig.default(Network.Mocha);
            config.bootnodes = [
              "/dnsaddr/da-bootstrapper-1-mocha-4.celestia-mocha.com/p2p/12D3KooWCBAbQbJSpCpCGKzqz3rAN4ixYbc63K68zJg9aisuAajg",
              "/dnsaddr/da-bootstrapper-2-mocha-4.celestia-mocha.com/p2p/12D3KooWCUHPLqQXZzpTx1x3TAsdn3vYmTNDhzg66yG8hqoxGGN8",
              "/dnsaddr/mocha-boot.pops.one/p2p/12D3KooWDzNyDSvTBdKQAmnsUdAyQCQWwM3ReXTmPaaf6LzfNwRs",
              "/dnsaddr/celestia-mocha.qubelabs.io/p2p/12D3KooWQVmHy7JpfxpKZfLjvn12GjvMgKrWdsHkFbV2kKqQFBCG",
              "/dnsaddr/celestia-mocha4-bootstrapper.binary.builders/p2p/12D3KooWK6AYaPSe2EP99NP5G2DKwWLfMi6zHMYdD65KRJwdJSVU",
              "/dnsaddr/celestia-testnet-boot.01node.com/p2p/12D3KooWR923Tc8SCzweyaGZ5VU2ahyS9VWrQ8mDz56RbHjHFdzW",
              "/dnsaddr/celestia-mocha-boot.zkv.xyz/p2p/12D3KooWFdkhm7Ac6nqNkdNiW2g16KmLyyQrqXMQeijdkwrHqQ9J",
            ];
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
