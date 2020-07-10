// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

contract DApp {

 	event Action(uint number);

 	uint public number;

 	function setnumber(uint _number) public {
    	number = _number;
        emit Action(number);
    } 

    function returnnumber() public view returns (uint) {
        return number;
    }
     
}