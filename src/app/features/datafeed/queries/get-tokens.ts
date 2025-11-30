import addressData from "@/app/lib/ethereum/address.json";

const alpha = addressData.alpha;

export const getTokens = async () => {
  return alpha;
};
