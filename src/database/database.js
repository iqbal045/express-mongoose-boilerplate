const { connect, set } = require('mongoose');

const config = require('config');
const chalk = require('chalk');

const mongoDB = config.get('MONGO_DB_URI');

const dbConnect = async () => {
  try {
    set('strictQuery', false);
    await connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(chalk.green.bold('Database connection is ready...'));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = dbConnect;
