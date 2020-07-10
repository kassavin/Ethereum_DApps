// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

contract DApp {

	event update(address sender, string Nickname);

	uint public users;
	uint public edits;

	struct profile {
		string nickname;
		uint edit;
		uint user;
	}

	mapping (address => profile) public nicknames;
	
   	function SetNickname(string memory _string) public {
   		nicknames[msg.sender].nickname = _string;
   		nicknames[msg.sender].edit++;
   		edits++;

   		if (nicknames[msg.sender].user == 0) {
   			users++;
   			nicknames[msg.sender].user = users;
   		}

   		emit update(msg.sender, _string);

   	}

   	function ReturnNickname() public view returns(string memory) {
   		return nicknames[msg.sender].nickname;
   	}

   	function Returnuser() public view returns(uint) {
   		return nicknames[msg.sender].user;
   	}

   	function Returnedit() public view returns(uint) {
   		return nicknames[msg.sender].edit;
   	}
     
}
