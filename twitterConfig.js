import dotenv from 'dotenv'
dotenv.config({ silent: true });

import { TwitterClient } from 'twitter-api-client';

const twitterClient = new TwitterClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_KEY_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});

export {
  twitterClient
}