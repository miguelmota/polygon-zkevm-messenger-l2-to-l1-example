# Polygon zkEVM Messenger L2->L1 Example

> Send a message from L2 [Polygon zkEVM](https://polygon.technology/polygon-zkevm) testnet to L1 Goerli.

## Example

There's two contracts; `L2Contract.sol` and `L1Contract.sol`

The L2 contract has a method `sendGreetingMessageToL1` that sends a message form L2 to L1 contract to set a greeting message on L1 contract.
It sends the encoded calldata to execute `setGreeting` on L1 which can only be called if the message was sent by the L2 contract.

### Files

- [`L2Contract.sol`](./contracts/L2Contract.sol)
- [`L1Contract.sol`](./contracts/L1Contract.sol)
- [`deployL2.js`](./script/deployL2.js)
- [`deployL1.js`](./scripts/deployL1.js)
- [`sendL2ToL1Message.js`](./scripts/sendL2ToL1Message.js)
- [`waitForInclusion.js`](./scripts/waitForInclusion.js)
- [`finalizeMessageOnL1.js`](./scripts/finalizeMessageOnL1.js)
- [`getGreetingOnL1.js`](./scripts/getGreetingOnL1.js)

## Install

```sh
git clone https://github.com/miguelmota/polygon-zkevm-messenger-l2-to-l1-example.git
cd polygon-zkevm-messenger-l2-to-l1-example
npm install
```

### Set Signer

Create `.env`

```sh
PRIVATE_KEY=123...
```

Make sure private key has funds on both Polygon zkEVM testnet and Goerli.

### Compile Contracts

```sh
npx hardhat compile
```

### Deploy L2 Contract

Command

```sh
npx hardhat run --network polygonzkevm scripts/deployL2.js
```

Output

```sh
L2Contract deployed to: 0x8Da765bB3F8fbcae3647Fc326D1F7d3337a5882A
```

### Deploy L1 Contract

Command

```sh
L2_CONTRACT=0x8Da765bB3F8fbcae3647Fc326D1F7d3337a5882A \
npx hardhat run --network goerli scripts/deployL1.js
```

Output

```sh
L1Contract deployed to: 0xd7f8d5a683D51fF90Aff7C25430CA3abAe3F80A0
```

### Send L2->L1 Message

Command (replace env vars with your values)

```sh
GREETING="hello world" \
L2_CONTRACT=0x8Da765bB3F8fbcae3647Fc326D1F7d3337a5882A \
L1_CONTRACT=0xd7f8d5a683D51fF90Aff7C25430CA3abAe3F80A0 \
npx hardhat run --network polygonzkevm scripts/sendL2ToL1Message.js
```

Output

```sh
sent tx hash 0x0085f32974b2b847bacb829f9006d89248cc6e53e3fb86f45cc348d94542ca22
https://testnet-zkevm.polygonscan.com/tx/0x0085f32974b2b847bacb829f9006d89248cc6e53e3fb86f45cc348d94542ca22
```

### Wait for L1 Root Inclusion

Command

```sh
L2_TX_HASH=0x0085f32974b2b847bacb829f9006d89248cc6e53e3fb86f45cc348d94542ca22 \
L1_CONTRACT=0xd7f8d5a683D51fF90Aff7C25430CA3abAe3F80A0 \
npx hardhat run --network polygonzkevm scripts/waitForInclusion.js
```

Output

```sh
Waiting for L1 root inclusion (this may take up to 60 minutes)...
{
  "leaf_type": 1,
  "orig_net": 1,
  "orig_addr": "0x8Da765bB3F8fbcae3647Fc326D1F7d3337a5882A",
  "amount": "0",
  "dest_net": 0,
  "dest_addr": "0xd7f8d5a683D51fF90Aff7C25430CA3abAe3F80A0",
  "block_num": "569430",
  "deposit_cnt": "23516",
  "network_id": 1,
  "tx_hash": "0x0085f32974b2b847bacb829f9006d89248cc6e53e3fb86f45cc348d94542ca22",
  "claim_tx_hash": "",
  "metadata": "0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000",
  "ready_for_claim": true
}
Ready to finalize message
```

### Finalize Message On L1

Command

```sh
L2_TX_HASH=0x0085f32974b2b847bacb829f9006d89248cc6e53e3fb86f45cc348d94542ca22 \
L1_CONTRACT=0xd7f8d5a683D51fF90Aff7C25430CA3abAe3F80A0 \
L2_CONTRACT=0x8Da765bB3F8fbcae3647Fc326D1F7d3337a5882A \
npx hardhat run --network goerli scripts/finalizeMessageOnL1.js
```

Output

```sh
sent tx hash 0xcaae7ee9dd1f8657a21f4598a4c8a9e97cd1341ddf1ca988ad371641bc3993af
https://goerli.etherscan.io/tx/0xcaae7ee9dd1f8657a21f4598a4c8a9e97cd1341ddf1ca988ad371641bc3993af
```

### Get Greeting on L1

Command

```sh
L1_CONTRACT=0xd7f8d5a683D51fF90Aff7C25430CA3abAe3F80A0 \
npx hardhat run --network goerli scripts/getGreetingOnL1.js
```

Output

```sh
greeting: hello world
```

### Send L1->L2 Message

See [https://github.com/miguelmota/polygon-zkevm-messenger-l2-to-l1-example](https://github.com/miguelmota/polygon-zkevm-messenger-l2-to-l1-example)

## License

[MIT](./LICENSE) @ [Miguel Mota](https://github.com/miguelmota)
