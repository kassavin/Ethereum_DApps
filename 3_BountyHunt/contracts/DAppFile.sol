// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

// https://kauri.io/truffle-adding-a-frontend-with-react-box/86903f66d39d4379a2e70bd583700ecf/a 

contract DApp {

  event BountyIssued(uint bounty_id, address issuer, uint amount, string data);
  event BountyFulfilled(uint bounty_id, address fulfiller, uint fulfillment_id, string data);
  event FulfillmentAccepted(uint bounty_id, address issuer, address fulfiller, uint indexed fulfillment_id, uint amount);
  event BountyCancelled(uint indexed bounty_id, address indexed issuer, uint amount);

  enum BountyStatus { CREATED, ACCEPTED, CANCELLED }

  struct Bounty {
      address payable issuer;
      uint deadline;
      string data;
      BountyStatus status;
      uint amount; //in wei
  }

  struct Fulfillment {
      bool accepted;
      address payable fulfiller;
      string data;
  }

  Bounty[] public bounties;

  mapping(uint=>Fulfillment[]) fulfillments;

  function issueBounty(string memory _data, uint64 _deadline) public payable hasValue() validateDeadline(_deadline) returns (uint) {
      bounties.push(Bounty(msg.sender, _deadline, _data, BountyStatus.CREATED, msg.value));
      emit BountyIssued(bounties.length - 1,msg.sender, msg.value, _data);
      return (bounties.length - 1);
  }

  function fulfillBounty(uint _bountyId, string memory _data) public bountyExists(_bountyId) notIssuer(_bountyId) hasStatus(_bountyId, BountyStatus.CREATED) isBeforeDeadline(_bountyId) {
    fulfillments[_bountyId].push(Fulfillment(false, msg.sender, _data));
    emit BountyFulfilled(_bountyId, msg.sender, (fulfillments[_bountyId].length - 1),_data);
  }

  function acceptFulfillment(uint _bountyId, uint _fulfillmentId) public bountyExists(_bountyId) fulfillmentExists(_bountyId,_fulfillmentId) onlyIssuer(_bountyId) hasStatus(_bountyId, BountyStatus.CREATED) fulfillmentNotYetAccepted(_bountyId, _fulfillmentId) {
      fulfillments[_bountyId][_fulfillmentId].accepted = true;
      bounties[_bountyId].status = BountyStatus.ACCEPTED;
      fulfillments[_bountyId][_fulfillmentId].fulfiller.transfer(bounties[_bountyId].amount);
      emit FulfillmentAccepted(_bountyId, bounties[_bountyId].issuer, fulfillments[_bountyId][_fulfillmentId].fulfiller, _fulfillmentId, bounties[_bountyId].amount);
  }

  function cancelBounty(uint _bountyId) public bountyExists(_bountyId) onlyIssuer(_bountyId) hasStatus(_bountyId, BountyStatus.CREATED) {
      bounties[_bountyId].status = BountyStatus.CANCELLED;
      bounties[_bountyId].issuer.transfer(bounties[_bountyId].amount);
      emit BountyCancelled(_bountyId, msg.sender, bounties[_bountyId].amount);
  }

  modifier hasValue() {
      require(msg.value > 0);
      _;
  }

  modifier bountyExists(uint _bountyId) {
    require(_bountyId < bounties.length);
    _;
  }

  modifier fulfillmentExists(uint _bountyId, uint _fulfillmentId) {
    require(_fulfillmentId < fulfillments[_bountyId].length);
    _;
  }

  modifier hasStatus(uint _bountyId, BountyStatus _desiredStatus) {
    require(bounties[_bountyId].status == _desiredStatus);
    _;
  }

  modifier onlyIssuer(uint _bountyId) {
      require(msg.sender == bounties[_bountyId].issuer);
      _;
  }

  modifier notIssuer(uint _bountyId) {
      require(msg.sender != bounties[_bountyId].issuer);
      _;
  }

  modifier fulfillmentNotYetAccepted(uint _bountyId, uint _fulfillmentId) {
    require(fulfillments[_bountyId][_fulfillmentId].accepted == false);
    _;
  }

  modifier validateDeadline(uint _newDeadline) {
      require(_newDeadline > now);
      _;
  }

  modifier isBeforeDeadline(uint _bountyId) {
    require(now < bounties[_bountyId].deadline);
    _;
  }

}
