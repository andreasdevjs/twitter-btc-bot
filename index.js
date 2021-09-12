import axios from "axios";
import  { twitterClient } from './twitterConfig.js';
import cron from 'node-cron';


const fromPriceToPorcentage = (price) => {
  return price / 1000;
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
  
  var bar_styles = ['░▒▓█'];

  function repeat(s, i) {
    var r = "";
    for (var j = 0; j < i; j++) r += s;
    return r;
  }

  function make_bar(p, bar_style, min_size, max_size) {
    var d,
      full,
      m,
      middle,
      r,
      rest,
      x,
      min_delta = Number.POSITIVE_INFINITY,
      full_symbol = bar_style[bar_style.length - 1],
      n = bar_style.length - 1;
    if (p == 100) return { str: repeat(full_symbol, 10), delta: 0 };
    p = p / 100;
    for (var i = max_size; i >= min_size; i--) {
      x = p * i;
      full = Math.floor(x);
      rest = x - full;
      middle = Math.floor(rest * n);
      if (p != 0 && full == 0 && middle == 0) middle = 1;
      d = Math.abs(p - (full + middle / n) / i) * 100;
      if (d < min_delta) {
        min_delta = d;
        m = bar_style[middle];
        if (full == i) m = "";
        r = repeat(full_symbol, full) + m + repeat(bar_style[0], i - full - 1);
      }
    }
    return { str: r };
  }

  function generate(porcentage) {
    var p = new Number(porcentage), min_size = 1, max_size = 15;
    var bars = [];
    for (var i = 0; i < bar_styles.length; i++) {
      bars.push(make_bar(p, bar_styles[i], min_size, max_size));
    }
    bars.sort(function (a, b) {
      return a.delta - b.delta;
    });
    return bars[0];
  }

  const tweetString = generate(porcentage);
  return `${tweetString.str} ${Math.round(porcentage)}%`;
}

const makeTweet = async function () {
  const bitcoinPrice = await getBitcoinPrice();
  const porcentage = fromPriceToPorcentage(bitcoinPrice)
  const tweet = buildTweetString(porcentage);
  try {
    const result = await twitterClient.tweets.statusesUpdate({status: tweet});
  } catch (error) {
    console.log(error);
  }
}

// Run cron at 16.30 New York timezone -> 30 16 * * *
const task = cron.schedule('30 16 * * *', () => {
  console.log('Running Tweet Cron');
  makeTweet();
},{ timezone : "America/New_York" });

task.start();