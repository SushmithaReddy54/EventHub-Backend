import mongoose from 'mongoose';
import { constants } from './constansts.js';

function connectDB() {
  mongoose.connect(constants.MONGO_URL
  ).then(() => {
    console.log('Connected to DB');
  }).catch((error) => {
    console.error('Error Connecting to DB', error);
  });
}

export default connectDB;