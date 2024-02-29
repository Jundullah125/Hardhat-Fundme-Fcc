const { assert, expect } = require("chai")
const { TransactionReceipt } = require("ethers")
const { deployments, getNamedAccounts, network } = require("hardhat")
const { ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.parseEther("51") //1ETH
          let provider
          provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/")

          beforeEach("FundMe", async function () {
              // deploy our fundme with hardhat
              // using hardhat deploy

              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])

              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", function () {
              it("it sets the aggregator getPriceFeed address correctly", async () => {
                  const response = await fundMe.getPriceFeed()

                  assert.equal(response, mockV3Aggregator.target)
              })

              describe("fund", async function () {
                  it("It fails if we don't send enough Eth", async function () {
                      await expect(fundMe.fund()).to.be.revertedWith(
                          "You need to spend more ETH!"
                      )
                  })

                  it("It updates the amount funded data structure", async function () {
                      await fundMe.fund({ value: sendValue })
                      const response = await fundMe.getAddressToAmountFunded(
                          deployer
                      )
                      assert.equal(response.toString(), sendValue)
                  })
                  it("Add funder to getFunders Array", async function () {
                      await fundMe.fund({ value: sendValue })
                      const funder = await fundMe.getFunders(0)
                      assert.equal(funder.toString(), deployer)
                  })
              })
              describe("withdraw", async function () {
                  beforeEach("Funding our account", async function () {
                      await fundMe.fund({ value: sendValue })
                  })

                  it("Withdraw from a single funder", async function () {
                      //Arrange
                      const startingFundmeBalance = await provider.getBalance(
                          fundMe.target
                      )

                      const startingDeployerBalance = await provider.getBalance(
                          deployer
                      )
                      //Act
                      const transactionResponse = await fundMe.withdraw()
                      const transactionReceipt = await transactionResponse.wait(
                          1
                      )

                      const endingFundmeBalance = await provider.getBalance(
                          fundMe.target
                      )

                      const endingDeployerBalance = await provider.getBalance(
                          deployer
                      )
                      //gasCost
                      //Assert
                      assert.equal(endingFundmeBalance.toString(), 0)
                      assert.equal(
                          startingFundmeBalance + startingDeployerBalance,
                          endingDeployerBalance
                      )
                  })
                  it(" it allows us to withdraw from multiple Funders", async function () {
                      //Arrange
                      const accounts = await new ethers.getAddress()
                      for (i = 1; i < 6; i++) {
                          const fundMeConnectedContract = await fundMe.connect(
                              accounts[i]
                          )
                          await fundMeConnectedContract.fund({
                              value: sendValue,
                          })
                      }

                      const startingFundmeBalance = await provider.getBalance(
                          fundMe.target
                      )

                      const startingDeployerBalance = await provider.getBalance(
                          deployer
                      )

                      //Acts

                      const transactionResponse = await fundMe.withdraw()
                      const transactionReceipt = await transactionResponse.wait(
                          1
                      )

                      // Asserts
                      assert.equal(endingFundmeBalance.toString(), 0)
                      assert.equal(
                          startingFundmeBalance + startingDeployerBalance,
                          endingDeployerBalance
                      )
                      await expect(fundMe.getFunders(0)).to.be.reverted

                      // Making sure that Funders are reset properly
                      for (i = 6; i < 6; i++) {
                          assert.equal(
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              ),
                              0
                          )
                      }
                  })
                  it(" It only allows the owner to withdraw", async function () {
                      const accounts = ethers.getAddress()
                      const attacker = accounts[1]
                      const attackerConnectedContract = await fundMe.connect(
                          attacker.address
                      )
                      //Assert
                      await expect(
                          attackerConnectedContract.withdraw()
                      ).to.be.revertedWith("fundMe_Not Owner")
                  })
              })
          })
      })
