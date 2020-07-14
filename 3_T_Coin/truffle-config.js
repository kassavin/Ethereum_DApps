var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "misery capable idle agree real tennis exchange forget spy copy cart minute";

module.exports = {

  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/55bf817414de4a5d87464f9055521329");
      },
      network_id: 4
    }
  },
 
  mocha: {
  },

  compilers: {
    solc: {
      version: "0.4.17",
    }
  }
}
