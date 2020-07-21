const ICO = artifacts.require("ICO.sol");

module.exports = function(deployer) {
  deployer.deploy(ICO, 'Kassavin Coin', 'KBG', 18, 1000000);
};
