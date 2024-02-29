const { network } = require("hardhat")
const { deployments, getNamedAccounts } = require("hardhat")
const DECIMALS = "8"
const INITIAL_PRICE = "200000000"

module.exports = async ({ getNamedAcccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        log("Local network detected, Deploying!")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
    }
    console.log("Mocks deployed")
}
module.exports.tags = ["all", "mocks"]
