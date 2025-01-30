import { useRef, useState, useEffect, createContext, ReactNode } from 'react';
import { NodeClient, spawnNode } from 'lumina-node';

export const LuminaContext = createContext<NodeClient | null>(null);

type Props = {
  children?: ReactNode
}

export function LuminaContextProvider({ children }: Props): ReactNode {
  const [lumina, setLumina] = useState<NodeClient | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      const node = await spawnNode();
      setLumina(node);
    };
    if (!initialized.current) {
      initialized.current = true;
      init();
    }
  }, []);

  return (
    <LuminaContext.Provider value={lumina}>{children}</LuminaContext.Provider>
  );
}
