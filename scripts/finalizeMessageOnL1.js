// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
const fetch = require('isomorphic-fetch')
require('dotenv').config()

async function main() {
  const l2TxHash = process.env.L2_TX_HASH
  const l1Contract = process.env.L1_CONTRACT
  const l2Contract = process.env.L2_CONTRACT
  const l1BridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7'
  const polygonZkEvmBridgeAbi = require('./PolygonZkEvmBridge.json')
  const signer = await hre.ethers.getSigner()
  const polygonZkEvmBridge = new hre.ethers.Contract(l1BridgeAddress, polygonZkEvmBridgeAbi, signer)

  const leafType = 1
  const originNetwork = 1
  const originAddress = l2Contract
  const amount = hre.ethers.utils.parseEther('0')
  const destinationNetwork = 0
  const destinationAddress = l1Contract
  let metadata = '0x'
  let index = 0

  const url = `https://bridge-api.public.zkevm-test.net/bridges/${l1Contract}?limit=25&offset=0`
  const res = await fetch(url)
  const json = await res.json()
  for (const item of json.deposits) {
    if (item.tx_hash === l2TxHash) {
      if (item.ready_for_claim) {
        index = item.deposit_cnt
        metadata = item.metadata
        break
      }
    }
  }

  if (!index) {
    throw new Error('expected deposit count index')
  }

  const metadataHash = hre.ethers.utils.solidityKeccak256(['bytes'], [metadata])
  const leafValue = await polygonZkEvmBridge.getLeafValue(
    leafType,
    originNetwork,
    originAddress,
    destinationNetwork,
    destinationAddress,
    amount,
    metadataHash
  )

  const proofUrl = `https://bridge-api.public.zkevm-test.net/merkle-proof?net_id=1&deposit_cnt=${index}`
  const proofRes = await fetch(proofUrl)
  const proofJson = await proofRes.json()
  const { merkle_proof: merkleProof, main_exit_root: mainExitRoot, rollup_exit_root: rollupExitRoot } = proofJson.proof
  const verified = await polygonZkEvmBridge.verifyMerkleProof(
    leafValue,
    merkleProof,
    index,
    rollupExitRoot
  )

  console.log('verified:', verified)

  if (!verified) {
    throw new Error('expected proof to be verified')
  }

  const tx = await polygonZkEvmBridge.claimMessage(
    merkleProof,
    index,
    mainExitRoot,
    rollupExitRoot,
    originNetwork,
    originAddress,
    destinationNetwork,
    destinationAddress,
    amount,
    metadata
  )

  console.log(`sent tx hash ${tx.hash}`)
  console.log(`https://goerli.etherscan.io/tx/${tx.hash}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
