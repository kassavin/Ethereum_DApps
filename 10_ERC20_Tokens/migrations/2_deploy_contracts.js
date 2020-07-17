const ERC20Token = artifacts.require("ERC20Token");

module.exports = function(deployer) {
  deployer.deploy(ERC20Token, 'Kassavin Coin', 'KBG', 18, 1000000);
};
