import {CoinflowEnvs} from "@coinflowlabs/react";

export function useCoinflowEnv(): CoinflowEnvs {
  return import.meta.env.VITE_ENV as CoinflowEnvs;
}
