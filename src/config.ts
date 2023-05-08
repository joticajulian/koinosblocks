const MAINNET_CHAIN_ID = 'EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==';
const HARBINGER_CHAIN_ID = 'EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==';
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || MAINNET_CHAIN_ID; // Chain ID of the network to connect to

const getDefaultApiNodes = () => {
  if (CHAIN_ID === HARBINGER_CHAIN_ID) {
    return ['https://harbinger-api.koinos.io'];
  }
  return ['https://api.koinosblocks.com', 'https://api.koinos.io'];
};

export const config = {
  HARBINGER_CHAIN_ID,
  MAINNET_CHAIN_ID,
  CHAIN_ID,
  GIT_COMMIT_HASH: import.meta.env.VITE_GIT_COMMIT_HASH || 'dev', // Git commit hash of the build
  DEFAULT_API_NODES: getDefaultApiNodes(),
};
