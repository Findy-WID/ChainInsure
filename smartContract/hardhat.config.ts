// import { sepolia } from 'wagmi/chains';
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-foundry");

require("dotenv").config(); // To load environment variables

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      // mJwuCqXLEMrHJkoS4b8OJQ-Aa_AkiASN
      url: `https://eth-sepolia.g.alchemy.com/v2/iSLLSObEq9i4Ty7d6QQm-Idzjc2BdPvt`, // Use the Alchemy API URL from the environment file
      // url: `https://base-sepolia.g.alchemy.com/v2/mJwuCqXLEMrHJkoS4b8OJQ-Aa_AkiASN`, // Use the Alchemy API URL from the environment file

      accounts: [process.env.PRIVATE_KEY], // Use your private key from the environment file
    },
    // You can add other networks like mainnet if needed
    // mainnet: {
    //   url: process.env.ALCHEMY_API_URL_MAINNET, // Alchemy Mainnet URL
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
};
