const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  //   let vrfCoordinatorV2Address, subscriptionId;
  // let habitAddress, subscriptionId;

  // const habit = await deploy("Habit", {
  //   from: deployer,
  //   args: [],
  //   log: true,
  //   waitConfirmations: network.config.blockConfirmations || 1,
  // });

  const habitFactory = await ethers.getContractFactory("Habit");
  console.log("Deploying contract...");
  const habit = await habitFactory.deploy();
  await habit.deployed();
  console.log(`Deployed contract to: ${habit.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await habit.deployTransaction.wait(6);
    await verify(habit.address, []);
  }

  const habitDetails = await habit.getHabit(0);
  console.log(`Habit detail is: ${habitDetails}`);

  // Update the current value
  // const transactionResponse = await habit.store(7)
  const transactionResponse = await habit.createHabit(0, 10, 30, {
    value: ethers.utils.parseEther("0.01"),
  });

  await transactionResponse.wait(1);
  // const updatedValue = await habit.retrieve()
  // console.log(`Updated Value is: ${updatedValue}`)
  // }

  const updatedHabitDetail = await habit.getHabit(0);
  console.log(`Updated Habit detail is: ${updatedHabitDetail}`);
  // }

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying....");
    await verify(habit.address);
  }
  log("-----------------------------------");
};

module.exports.tags = ["all", "habit"];
