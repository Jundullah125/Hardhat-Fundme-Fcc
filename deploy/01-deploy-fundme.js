// function deployfunc(hre) {
//   const { getNamedAccounts, deployments } = hre;
//   const { deploy, log } = deployments;
//   const { deployer } = getNamedAccounts();
//   //module.exports= async {(getnamedAcccounts, deployments)} => {
//     // const { deploy, log } = deployments;
//     // const { deployer } = getNamedAccounts();
//   // }
// }

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

// module.exports.default = deployfunc;
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    console.log("Deploying fund me...... ")

    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put priceFeed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`FundMe deployed at ${fundme.address}`)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundme.address, [ethUsdPriceFeedAddress])
    }

    log("Contracts deployed!!!!")

    log("___________________________________________________")
}

module.exports.tags = ["all", "fundme"]
