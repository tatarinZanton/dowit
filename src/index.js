const util = require('util');
const config = require('config');
const yargs = require('yargs');
const USPS = require('./usps');
const csv = require('./csv');
const fs = require('fs');
const Email = require('email-templates');
const { containerTypes } = require('./constants/container-types');
const { saveCalculation } = require('./saveCalculation');
const csvParse = util.promisify(csv.parse);

const email = new Email({
  message: {
    from: config.mail.from,
  },
  transport: config.mail,
});

const options = yargs
  .usage('Usage: -e <userEmail>')
  .option('e', {
    alias: 'userEmail',
    describe: 'User email to send calculation results',
    type: 'string',
    demandOption: true,
  })
  .option('f', { alias: 'file', describe: 'CSV file name', type: 'string', demandOption: false })
  .array('u').argv;

let proportions = {
  Width: options._[0],
  Height: options._[1],
  Length: options._[2],
  Pounds: options._[3],
  Ounces: options._[4],
};

if (options.file) {
  useCsvFile();
} else {
  useOptions();
}

async function useOptions() {
  let deliveryCalculation;
  try {
    deliveryCalculation = await USPS.calculate([
      {
        ...proportions,
        ZipDestination: options._[5],
        Container: containerTypes[options._[6]],
        Machinable: false,
      },
    ]);
    await saveCalculation(deliveryCalculation, options.userEmail);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  sendEmail(options.userEmail);
}

async function useCsvFile() {
  //check if file exists

  fs.access(__dirname + '/csv/' + options.file, fs.F_OK, async err => {
    if (err) {
      console.error(err);
      return;
    }

    try {
      let recipients = await csvParse(options.file);
      recipients = await recipients.map(recipient => {
        return {
          ...recipient,
          ...proportions,
        };
      });

      let calculationList = await USPS.calculate(recipients);

      await saveCalculation(calculationList, options.userEmail, options.file);
    } catch (error) {
      console.error(error);
    }

    sendEmail(options.userEmail);
  });
}

function sendEmail(userEmail) {
  email
    .send({
      template: 'calculationFinished',
      message: {
        to: userEmail,
      },
      locals: {
        name: 'John Doe',
      },
    })
    .then(() => {
      process.exit(0);
    })
    .catch(console.error);
}
