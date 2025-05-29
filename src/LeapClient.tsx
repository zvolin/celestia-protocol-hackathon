import { useRef, useState, useEffect, createContext, ReactNode } from 'react';
import { TxClient } from 'lumina-node';

export const LeapClientContext = createContext<TxClient | null>(null);

type Props = {
  children?: ReactNode
}

export function LeapClientContextProvider({ children }: Props): ReactNode {
  const [leapClient, setLeapClient] = useState<TxClient | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      const leap = (window as any).leap;
      if (leap === undefined) {
        alert("Leap extension not found");
      }
      await leap.enable("mocha-4");
      const keys = await leap.getKey("mocha-4");

      const signer = (signDoc: any) => {
        return leap.signDirect("mocha-4", keys.bech32Address, signDoc, { preferNoSetFee: true })
          .then((sig: any) => Uint8Array.from(atob(sig.signature.signature), c => c.charCodeAt(0)))
      }
      try {
        const txClient = await new TxClient("http://151.115.60.15:9091", keys.bech32Address, keys.pubKey, signer);
        setLeapClient(txClient);
      } catch (error) {
        alert(`Error creating grpc client. Make sure your account is funded on mocha: ${error}`);
      }
    };
    if (!initialized.current) {
      initialized.current = true;
      init();
    }
  }, []);

  return (
    <LeapClientContext.Provider value={leapClient}>{children}</LeapClientContext.Provider>
  );
}
