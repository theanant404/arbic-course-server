import dotenv from 'dotenv';
import { httpServer } from './app.js';
import connectDB from './src/db/index.js';
dotenv.config({
    path: './.env',
})

const majorNodeversion = process.versions.node.split('.')[0];
if (majorNodeversion < 18) {
    console.error('Node version must be 18 or higher');
    process.exit(1);
}
const startServer=()=>{
    httpServer.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT},http://localhost:${process.env.PORT}`);
        console.log(`Node version: ${process.versions.node}`);
    });
}

if (majorNodeversion >= 14) {
    try {
      await connectDB();
      startServer();
    } catch (err) {
      console.log("Mongo db connect error: ", err);
    }
  } else {
    connectDB()
      .then(() => {
        startServer();
      })
      .catch((err) => {
        console.log("Mongo db connect error: ", err);
      });
  }