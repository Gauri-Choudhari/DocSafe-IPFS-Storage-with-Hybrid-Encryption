require("@nomicfoundation/hardhat-toolbox");
const ALCHEMY_API_KEY = "uN-HNd3EyguCXpHu3wSIoc9-hFGpIbQK";
const SEPOLIA_PRIVATE_KEY = "15e46d4a4ce95ea20d2351aef41bfc4e56363c3037f512ed0ab4d9aaaa66f070"; //test account 2

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    }
  },
};
