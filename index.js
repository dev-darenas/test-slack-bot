require('dotenv').config()
const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');
const { modalCallback, languageCallback, viewIncidentCallback, datePickerCallback, reactionCallback, plainTextInputCallback, closeIncidentCallback, closeActionCallback, selectInputCallback } = require('./callbacks');

// Initializes your app with your bot token and signing secret

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG
});

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