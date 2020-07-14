// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

contract MyStringStore {

  string public myString = "Hello World";

  function set(string memory x) public {
    myString = x;
  }
  
}
