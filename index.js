require('dotenv').config()
const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');
const { modalCallback, languageCallback, viewIncidentCallback, datePickerCallback, reactionCallback, plainTextInputCallback, closeIncidentCallback, closeActionCallback, selectInputCallback } = require('./callbacks');
const IncidentService = require('./services/incidentServices.js');

// Initializes your localhost app
const receiver = new ExpressReceiver({ 
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG
});


// Initializes your app with your bot token and signing secret

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
  receiver
});

const path = require('path');

receiver.app.set('views', path.join(__dirname, 'views'));
receiver.app.set('view engine', 'pug');
//receiver.app.use(receiver.express.static(path.join(__dirname, 'public')))

(async () => {
  // Start your app
  await app.start(process.env.PORT || 10000);

  console.log('⚡️ Bolt app is running!');
})();

app.message(/(incidencia|ayuda|problema).*/, languageCallback);

// *********
// COMANDO /INCIDENCIA
// *********
app.command('/incidencia', modalCallback)

app.command('/cerrar-incidencia', closeIncidentCallback)

app.shortcut('shortcut_close_incident', closeIncidentCallback)

app.action('close_incident', closeActionCallback)

// *********
// ACCIÓN: Ejecutar modal a partir de texto detectado
// *********
app.action('create_incident_action', modalCallback)

app.view('view_incident', viewIncidentCallback)

app.action('datepicker_remind', datePickerCallback)

app.action('select_incident_type', selectInputCallback)

app.action('plain_text_input-action', plainTextInputCallback)

app.event('reaction_added', reactionCallback)

// ROUTES //
// Other web requests are methods on receiver.router
receiver.router.get('/incidentes', (req, res) => {
  // You're working with an express req and res now.
   // res.send('yay!');

  console.log("console!!")
  const incidentService = new IncidentService();
  console.log(JSON.stringify(incidentService.getIncidents()))

  res.render('incident/index.pug', { 
    incidents: [
      {
        permalink: 'https://teamfire-4.slack.com/archives/C02JDT4U615/p1635116640010800',
        author: 'Daniel Arenas',
        status: 'closed',
        type: 'CRM',
        date: '2021/10/20'
      },
      {
        permalink: 'https://teamfire-4.slack.com/archives/C02JDT4U615/p1635116640010800',
        author: 'Daniel Arenas',
        status: 'closed',
        type: 'CRM',
        date: '2021/10/21'
      },
      {
        permalink: 'https://teamfire-4.slack.com/archives/C02JDT4U615/p1635116640010800',
        author: 'Daniel Arenas',
        status: 'in_progress',
        type: 'Core',
        date: '2021/10/22'
      },
      {
        permalink: 'https://teamfire-4.slack.com/archives/C02JDT4U615/p1635116640010800',
        author: 'Daniel Arenas',
        status: 'started',
        type: 'Core',
        date: '2021/10/22'
      },
      {
        permalink: 'https://teamfire-4.slack.com/archives/C02JDT4U615/p1635116640010800',
        author: 'Daniel Arenas',
        status: 'started',
        type: 'Core',
        date: '2021/10/23'
      }
    ]
  });
});
