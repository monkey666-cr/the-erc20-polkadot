import { Wallet } from "@/app/features/web3/components/wallet";

const Header = () => {
  return (
    <div className="fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex justify-between py-2.5 px-5 items-center">
      <span className="text-lg font-semibold">
        Polkadot Hub TestNet ERC20 Faucet
      </span>

      <Wallet />
    </div>
  );
};

export { Header };
