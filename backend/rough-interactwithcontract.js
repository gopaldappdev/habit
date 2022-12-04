const ethers  = require("ethers");

const url = 'https://rpc-mumbai.maticvigil.com'
const provider = new ethers.providers.JsonRpcProvider(url);
const habitContractAddress = '0x0AaB2510927e5dE0188df1ab7a459534C0B95462'
const habitContractAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"habitId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalReports","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interval","type":"uint256"}],"name":"HabitCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"habitId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reportedAt","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"successCount","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"missedCount","type":"uint32"}],"name":"HabitReported","type":"event"},{"inputs":[{"internalType":"uint256","name":"habitId","type":"uint256"},{"internalType":"uint32","name":"totalReports","type":"uint32"},{"internalType":"uint256","name":"interval","type":"uint256"}],"name":"createHabit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"habitId","type":"uint256"}],"name":"getHabit","outputs":[{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint32","name":"totalReports","type":"uint32"},{"internalType":"uint256","name":"interval","type":"uint256"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"uint32","name":"successCount","type":"uint32"},{"internalType":"uint32","name":"missedCount","type":"uint32"},{"internalType":"uint256","name":"amountWithdrawn","type":"uint256"}],"internalType":"struct Habit.HabitCore","name":"habit","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"habitId","type":"uint256"}],"name":"report","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWithdrawals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const habitContract_read = new ethers.Contract(habitContractAddress, habitContractAbi, provider) 

habitContract_read.getHabit(0).then((result) => {
    console.log(result);
    console.log(result.interval.toNumber());
})

// habitContract_read.totalDeposits().then((result) => {
//     console.log(result);
// })

// habitContract_read.totalWithdrawals().then((result) => {
//     console.log(result);
// })