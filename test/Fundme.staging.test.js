const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { assert, expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let FundMe
          let deployer
          const sendValue = ethers.parseEthers("51")

          beforeEach(async function () {
              deployer = (await FundMe.getNamedAccounts).deployer
              fundme = await ethers.getContract(FundMe.target, deployer)
          })
          it("it allows the fund and withdraw function", async function () {
              await fundme.fund({ value: sendValue })
              await fundme.withdraw()
              const endingBalance = await provider.getBalance(fundme.address)
              assert.equal(endingBalance.toString(), "0")
          })
      })
