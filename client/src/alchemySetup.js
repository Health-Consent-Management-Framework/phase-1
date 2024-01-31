import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: "D6bKe5JOA5f425ZNzoRKMQfftcUy2ZSo",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);