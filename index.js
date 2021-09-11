import  { twitterClient } from './twitterConfig.js';
import cron from 'node-cron';

const fromPriceToPorcentage = (price) => {
  // convuerte usd en porncetaje
  return price;
}

const getBitcoinPrice = async () => {
  // Instalar axios y hacer llamada.. explicado aqiuí: https://www.coingecko.com/es/api/documentation se puede ver el ejemplo
  // recibo el precio y lo convierto en el porcentaje
  // construimos el string del precio.
}

const makeTweet = async function () {
  const data = twitterClient.tweets.statusesUpdate({status: 'Hola'});
  console.log(data);
}


// Run cron at 16.30 New York timezone
const task = cron.schedule('30 16 * * *', () => {
  console.log('running cron');
  makeTweet();
},{ timezone : "America/New_York" });

task.start();