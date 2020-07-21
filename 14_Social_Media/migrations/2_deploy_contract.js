const Tweeter = artifacts.require("Tweeter");

module.exports = async function(deployer, _network, accounts) {

  await deployer.deploy(Tweeter, accounts[0]);
  const tweeter = await Tweeter.deployed();

  await tweeter.tweet("Today I feel great!");
  await tweeter.tweet("Who want to party this weekend?");
  await tweeter.tweet("I HATE the butterfly keyboard of macbook pro...");

  await tweeter.tweet("I want to make America great again!", {from: accounts[1]});
  await tweeter.tweet("Build the wall!", {from: accounts[1]});

};
