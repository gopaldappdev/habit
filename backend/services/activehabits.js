const ethers  = require("ethers");

const url = 'https://rpc-mumbai.maticvigil.com'
const provider = new ethers.providers.JsonRpcProvider(url);

const habitContractAddress = '0x9506faa99444fA1fD8496E2B5e56991e1a807840'
const habitContractAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"habitId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalReports","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"successCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"missedCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountWithdrawn","type":"uint256"}],"name":"HabitCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"habitId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalReports","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interval","type":"uint256"}],"name":"HabitCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"habitId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"journalEntry","type":"string"},{"indexed":false,"internalType":"string","name":"proofUrl","type":"string"},{"indexed":false,"internalType":"uint256","name":"reportedAt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"successCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"missedCount","type":"uint256"}],"name":"HabitReported","type":"event"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"committment","type":"string"},{"internalType":"uint256","name":"totalReports","type":"uint256"},{"internalType":"uint256","name":"interval","type":"uint256"}],"name":"createHabit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"habitId","type":"uint256"}],"name":"getHabit","outputs":[{"components":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"committment","type":"string"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"totalReports","type":"uint256"},{"internalType":"uint256","name":"interval","type":"uint256"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"uint256","name":"successCount","type":"uint256"},{"internalType":"uint256","name":"missedCount","type":"uint256"},{"internalType":"uint256","name":"amountWithdrawn","type":"uint256"}],"internalType":"struct Habit.HabitCore","name":"habit","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserHabitNonce","outputs":[{"internalType":"uint256","name":"userHabitLength","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserHabits","outputs":[{"internalType":"uint256[]","name":"userHabits","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes32","name":"titleHash","type":"bytes32"},{"internalType":"bytes32","name":"committmentHash","type":"bytes32"}],"name":"hashHabit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"habitId","type":"uint256"},{"internalType":"string","name":"journalEntry","type":"string"},{"internalType":"string","name":"proofUrl","type":"string"}],"name":"report","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"totalAmountDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAmountWithdrawn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const habitContract_read = new ethers.Contract(habitContractAddress, habitContractAbi, provider) 

function getActiveHabits(){
    let arr = []

    // habitContract_read.getAllHabits().then((result) => {
    
    //     for(let i=0; i<result.length; i++){
    //         let habit = result[i]
    //         if(habit.ended === false){
    //             arr.push(habit)
    //         }  
    //     }
    
    // })

    // habitContract_read.getAllActiveHabits().then((result) => {
    
    //     for(let i=0; i<result.length; i++){
    //         let habit = result[i]
    //         if(habit.ended === false){
    //             arr.push(habit)
    //         }  
    //     }
    
    // })

    return arr

    // let arr = []

    // let obj1 = {
    //     user: "0x5a7f2416D08E9Bd3C272D7b361529D3B8c4c5C1c",
    //     startTime: 1670076214,
    //     interval: 30,
    //     successCount: 0,
    //     missedCount: 0
    // }

    // arr.push(obj1)
    // return arr;
}

module.exports = {
    getActiveHabits,
}
