//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/// @title The bridge interface implemented on both chains
interface IBridge {
  function bridgeMessage(
      uint32 destinationNetwork,
      address destinationAddress,
      bool forceUpdateGlobalExitRoot,
      bytes calldata metadata
  ) external payable;
}
