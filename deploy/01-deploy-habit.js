const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const habitId = ethers.utils.formatBytes32String(networkConfig[chainId]["habitId"])
    const totalReports = networkConfig[chainId]["totalReports"]
    const interval = networkConfig[chainId]["interval"]
    const amount = networkConfig[chainId]["amount"]

    //   let vrfCoordinatorV2Address, subscriptionId;
    // let habitAddress, subscriptionId;
    if (chainId == 31337) {
        // create VRFV2 Subscription
        const habitFactory = await ethers.getContractFactory("Habit")
        console.log("Deploying contract...")
        const habit = await habitFactory.deploy()
        await habit.deployed()
        console.log(`Deployed contract to: ${habit.address}`)

        const transactionResponse = await habit.createHabit(habitId, totalReports, interval, {
            value: ethers.utils.parseEther(amount),
        })
    }
    // const habit = await deploy("Habit", {
    //   from: deployer,
    //   args: [],
    //   log: true,
    //   waitConfirmations: network.config.blockConfirmations || 1,
    // });

    const habitFactory = await ethers.getContractFactory("Habit")
    console.log("Deploying contract...")
    const habit = await habitFactory.deploy()
    await habit.deployed()
    console.log(`Deployed contract to: ${habit.address}`)
    // what happens when we deploy to our hardhat network?
    // if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    //     console.log("Waiting for block confirmations...")
    //     await habit.deployTransaction.wait(6)
    //     await verify(habit.address, [])
    // }

    const habitDetails = await habit.getHabit(habitId)

    console.log(`Habit detail is: ${habitDetails}`)
    const transactionResponse = await habit.createHabit(habitId, totalReports, interval, {
        value: ethers.utils.parseEther(amount),
    })

    await transactionResponse.wait(6)

    const updatedHabitDetail = await habit.getHabit(habitId)
    console.log(`Updated Habit detail is: ${updatedHabitDetail}`)
    // }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying....")
        await verify(habit.address)
    }
    log("-----------------------------------")
}

module.exports.tags = ["all", "habit"]
