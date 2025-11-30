"use client";

import { ExternalLink,Wallet as WalletIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type Connector,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useEnsName,
} from "wagmi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Wallet = () => {
  const account = useConnection();
  const { data: ensName } = useEnsName({ address: account.address });
  const { connect, error, isPending } = useConnect();
  const connectors = useConnectors();
  const { disconnect } = useDisconnect();
  const [selectedConnector, setSelectedConnector] = useState<string>("");

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const displayedAddress = useMemo(() => {
    if (!account.isConnected || !account.address) {
      return "";
    }
    return ensName || formatAddress(account.address);
  }, [ensName, account.address, account.isConnected]);

  const handleConnect = () => {
    const connector = connectors.find(c => c.id === selectedConnector);
    if (connector) {
      connect({ connector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setSelectedConnector("");
  };

  const getConnectorName = (connector: Connector) => {
    if (connector.name.toLowerCase().includes('metamask')) {
      return 'MetaMask';
    }
    if (connector.name.toLowerCase().includes('walletconnect')) {
      return 'WalletConnect';
    }
    if (connector.name.toLowerCase().includes('coinbase')) {
      return 'Coinbase';
    }
    return connector.name;
  };

  if (account.isConnected && account.address) {
    return (
      <div className="flex gap-4 items-center">
        <Input value={displayedAddress} disabled className="w-64" />
        <Button type="button" variant="outline" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Your Wallet Address"
        disabled
        value=""
        className="w-64"
      />
      {connectors.length > 0 ? (
        <div className="flex gap-2 items-center">
          <Select value={selectedConnector} onValueChange={setSelectedConnector}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Wallet" />
            </SelectTrigger>
            <SelectContent>
              {connectors.map((connector) => (
                <SelectItem key={connector.id} value={connector.id}>
                  {getConnectorName(connector)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={handleConnect}
            disabled={isPending || !selectedConnector}
          >
            {isPending ? "Connecting..." : "Connect"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">No wallet found</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <WalletIcon className="w-4 h-4" />
            Install MetaMask
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
    </div>
  );
};
