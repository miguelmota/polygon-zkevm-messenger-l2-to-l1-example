//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IBridge.sol";

contract L2Contract {
    address l2Bridge;

    constructor(address _l2Bridge) {
      l2Bridge = _l2Bridge;
    }

    function sendMessageToL1(address _to, bytes memory _calldata) payable public {
      IBridge bridge = IBridge(l2Bridge);
      uint32 destinationNetwork = 0;
      bool forceUpdateGlobalExitRoot = true;
      bridge.bridgeMessage{value: msg.value}(
        destinationNetwork,
        _to,
        forceUpdateGlobalExitRoot,
        _calldata
      );
    }
}
