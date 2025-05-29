import { useState, useContext } from 'react'
import { LuminaContext, LuminaContextProvider } from './Lumina.tsx'
import { LeapClientContext, LeapClientContextProvider } from './LeapClient.tsx'
import { AppVersion, Blob, Namespace, Network, NodeConfig, TxInfo } from 'lumina-node'
import './App.css'

function App() {
  return (
    <LeapClientContextProvider>
      <LuminaContextProvider>
        <main>
          <Launcher />
          <Stats />
        </main>
      </LuminaContextProvider>
    </LeapClientContextProvider>
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
  const txClient = useContext(LeapClientContext);
  const [_, setTxInfo] = useState<TxInfo | null>(null);

  if (!txClient) {
    return <div>Connect leap wallet to proceed</div>;
  }

  return (
    <button
      onClick={async () => {
        const ns = Namespace.newV0(new Uint8Array([97, 98, 99]));
        const data = new Uint8Array([100, 97, 116, 97]);
        const blob = new Blob(ns, data, AppVersion.latest());

        const txInfo = await txClient.submitBlobs([blob]);
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", txInfo);
        setTxInfo(txInfo);
      }}
    >
      Submit blob
    </button>
  );
}
