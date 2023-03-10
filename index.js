require('dotenv').config();
const chalk = require('chalk');
const config = require('config');
const app = require('./src/app');
const dbConnect = require('./src/database/database');

try {
  console.log(
    chalk.green.inverse(`APP_ENV: ${config.get('env').toUpperCase()}`),
  );
  dbConnect()
    .then(() => {
      app.listen(config.get('PORT'), () => {
        console.log(
          chalk.green.bold(
            `Server is running on port ${config.get('PORT')}...`,
          ),
        );
      });
    })
    .catch(err => {
      console.log(chalk.red(err));
      process.exit(1);
    });
} catch (err) {
  console.log(chalk.red(err));
  process.exit(1);
}
