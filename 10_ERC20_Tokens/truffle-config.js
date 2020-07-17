const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "misery capable idle agree real tennis exchange forget spy copy cart minute";

module.exports = {

  contracts_build_directory: "./src/contracts",

  networks: {
   
    rinkeby: {
      provider: () =>
        new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/55bf817414de4a5d87464f9055521329"),
      network_id: 4
    }

  },
 
  compilers: {
    solc: {
      version: "0.5.17",
    }
  }
}