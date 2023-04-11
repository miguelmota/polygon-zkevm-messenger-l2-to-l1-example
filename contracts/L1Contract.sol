//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract L1Contract {
    string private greeting;
    address l2Contract;
    address l1Bridge;
    address private caller;

    constructor(address _l2Contract, address _l1Bridge) {
      l2Contract = _l2Contract;
      l1Bridge = _l1Bridge;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function onMessageReceived(address originAddress, uint32 originNetwork, bytes memory data) external payable {
      require(originAddress == l2Contract);
      require(originNetwork == 1);
      caller = originAddress;
      (bool success, ) = address(this).call(data);
      if (!success) {
        revert('metadata execution failed');
      }
    }

    function setGreeting(string memory _greeting) public {
        require(caller == l2Contract);
        greeting = _greeting;
    }
}
