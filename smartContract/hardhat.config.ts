// import { sepolia } from 'wagmi/chains';
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-foundry");

require("dotenv").config(); // To load environment variables

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_API_KEY}`, // Use the Alchemy API URL from the environment file

      accounts: [process.env.PRIVATE_KEY], // Use your private key from the environment file
    },
    // You can add other networks like mainnet if needed
    // mainnet: {
    //   url: process.env.ALCHEMY_API_URL_MAINNET, // Alchemy Mainnet URL
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
};
