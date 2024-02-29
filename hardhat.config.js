require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-ethers")

require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY =
    process.env.ETHERSCAN_API_KEY || "HYCE3VIV9H958T3NUS68JM1VPIG37S83XV"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
    deFaultNetwork: "hardhat",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545/",
            //accounts: Thanks Hardhat
            chainId: 31337,
        },
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/xrPKSlFOASPOa4UhhVO_xYi6xvX34N2n",
            chainId: 11155111,
            blockConfirmations: 6,
            accounts: [PRIVATE_KEY],
        },
    },
    // solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-reporter.txt",
        noColors: true,
        currency: "usd",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        users: {
            default: 1,
        },
    },
}
