const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const committed = networkConfig[chainId]["committed"]
    const title = networkConfig[chainId]["title"]
    const totalReports = networkConfig[chainId]["totalReports"]
    const interval = networkConfig[chainId]["interval"]
    const amount = networkConfig[chainId]["amount"]
    const validator = networkConfig[chainId]["validator"]

    if (chainId == 31337) {
        const habitFactory = await ethers.getContractFactory("Habit")
        console.log("Deploying contract...")
        const habit = await habitFactory.deploy()
        await habit.deployed()
        console.log(`Deployed contract to: ${habit.address}`)

        const transactionResponse = await habit.createHabit(
            title,
            committed,
            totalReports,
            interval,
            validator,
            {
                value: ethers.utils.parseEther(amount),
            }
        )
        await transactionResponse.wait(1)
        console.log(`Transaction confirmed in ${transactionResponse}`)
    } else if (chainId != 31337) {
        const habitFactory = await ethers.getContractFactory("Habit")
        console.log("Deploying contract to testnet...")
        const habit = await habitFactory.deploy()
        await habit.deployed()
        console.log(`Deployed contract to: ${habit.address}`)

        const transactionResponse = await habit.createHabit(
            title,
            committed,
            totalReports,
            interval,
            validator,
            {
                value: ethers.utils.parseEther(amount),
            }
        )
        await transactionResponse.wait(6)

        if (!developmentChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
            log("Verifying....")
            await verify(habit.address)
        }
        log("-----------------------------------")
    }
}

module.exports.tags = ["all", "habit"]
