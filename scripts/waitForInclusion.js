const hre = require('hardhat')
const fetch = require('isomorphic-fetch')
const wait = require('wait')
require('dotenv').config()

async function main() {
  console.log('Waiting for L1 root inclusion (this may take up to 60 minutes)...')
  while (true) {
    const l2TxHash = process.env.L2_TX_HASH
    const l1Contract = process.env.L1_CONTRACT
    const url = `https://bridge-api.public.zkevm-test.net/bridges/${l1Contract}?limit=25&offset=0`
    const res = await fetch(url)
    const json = await res.json()
    for (const item of json.deposits) {
      if (item.tx_hash === l2TxHash) {
        if (item.ready_for_claim) {
          console.log(JSON.stringify(item, null, 2))
          console.log('Ready to finalize message')
          process.exit(0)
        }
      }
    }
    await wait (10 * 1000)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
