import axios from "axios";
import  { twitterClient } from './twitterConfig.js';
import cron from 'node-cron';


const fromPriceToPorcentage = (price) => {
  return price / 100;
}

const getBitcoinPrice = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.data;
    const price = data.bitcoin.usd;
    return price;
  } catch (error) {
    console.error(error);
  }
}

const buildTweetString = (porcentage) => {
  return porcentage.toString();
}

const makeTweet = async function () {
  const bitcoinPrice = await getBitcoinPrice();
  const porcentage = fromPriceToPorcentage(bitcoinPrice)
  const tweet = buildTweetString(porcentage);
  try {
    const result = await twitterClient.tweets.statusesUpdate({status: tweet});
    console.log('RESULTADO: ', result)
  } catch (error) {
    console.log(error);
  }
}

// Run cron at 16.30 New York timezone -> 30 16 * * *
const task = cron.schedule('* * * * *', () => {
  console.log('Running Tweet Cron');
  makeTweet();
},{ timezone : "America/New_York" });

task.start();