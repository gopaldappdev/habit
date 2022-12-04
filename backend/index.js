// Import the required packages
const cron = require('node-cron');
const { getNotifications } = require("./services/push");
const { getActiveHabits } = require("./services/activehabits")


cron.schedule('*/5 * * * * *', run);

async function run(){
  console.log("log1");
  let activeHabits = await getActiveHabits()
  for(let i=0; i<activeHabits.length; i++){
    let habit = activeHabits[i]
    if(toSendNotif(habit) === true){
      let user = habit.user
      console.log("log2");
      getNotifications() // send user in this function
    }
  }
}

function toSendNotif(habit){
  console.log("log3");
  const startTime = habit.startTime // 1670076214
  const interval = habit.interval // 30, in seconds
  const successCount = habit.successCount
  const missedCount = habit.missedCount

  let endTimeOfThisReport = startTime + interval * (successCount + missedCount + 1)

  let currentTime = Math.round(Date.now() / 1000)
  console.log(currentTime);

  if(endTimeOfThisReport - currentTime <= (0.2 * interval)){
    console.log("log4");
    return true
  }
  else{
    return false
  }
  
}

// getNotifications();