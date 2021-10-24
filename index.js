const SLACK_SIGNING_SECRET=""
const SLACK_BOT_TOKEN="xoxb-2652709298097-26"
const SLACK_APP_TOKEN="xapp-1-A02JWJVS1PE-26"

const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({ 
  signingSecret: SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG
});

// Initializes your app with your bot token and signing secret
const app = new App({
  token: SLACK_BOT_TOKEN,
  socketMode: false,
  appToken: SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
  receiver
});

const path = require('path');

receiver.app.set('views', path.join(__dirname, 'views'));
receiver.app.set('view engine', 'pug');
//receiver.app.use(receiver.express.static(path.join(__dirname, 'public')))

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

async function noBotMessages({ message, next }) {
  if (!message.subtype || message.subtype !== 'bot_message') {
    await next();
  }
}

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there from Dani <@${message.user}>!`);
});

app.message(/^(hi|hello|hey|hola).*/, async ({ context, message, say }) => {
// say() sends a message to the channel where the event was triggered

  const greeting = context.matches[0];

  console.log("message")
  console.log(JSON.stringify(message))

  await say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `${greeting}!! there <@${message.user}>!`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me"
          },
          "action_id": "button_click_custom"
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  });
});

app.event('reaction_added', async ({ event, say }) => {
  switch (event.reaction) {
    case 'calendar':
      await say({
        blocks: [{
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Pick a date for me to remind you"
          },
          "accessory": {
            "type": "datepicker",
            "action_id": "datepicker_remind",
            "initial_date": "2019-04-28",
            "placeholder": {
              "type": "plain_text",
              "text": "Select a date"
            }
          }
        }]
      });
    break;
    case 'eyes':
      await say({
        text:`tu incidente ya esta siendo mirado por <@${event.user}>`,
        thread_ts: event.item.ts
      })
    break;
  }
});

app.message('cerrar incidente', async ({ message, say }) => {
  
  threadTs = message.thread_ts ? message.thread_ts : message.ts;

  await say({text:`<@${message.user}> Caso cerrado`,thread_ts: threadTs, blocks : [
    {
      "type": "header",
      "text": {
          "type": "plain_text",
          "text": "Exelente... Hora de cerrar el incidente!! :fire",
          "emoji": true
      }
    },
    {
      "type": "input",
      "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "plain_text_input-action"
      },
      "label": {
          "type": "plain_text",
          "text": "Causa del incidente",
          "emoji": true
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "input",
      "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "plain_text_input-action"
      },
      "label": {
          "type": "plain_text",
          "text": "Solución del incidente :computer:  :",
          "emoji": true
      }
    },
    {
			"type": "actions",
			"elements": [
				{
					"type": "button",
          "style": "primary",
					"text": {
						"type": "plain_text",
						"text": "Cerrar",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "close"
				}
			]
		}
  ]})
});

app.action('close', async ({ body, ack, say }) => {
  await ack();
  await say({text: 'incidencia cerrada!! 👍', thread_ts: body.message.ts });
});

// Your middleware will be called every time an interactive component with the action_id “approve_button” is triggered
app.action('approve_button', async ({ ack, say }) => {
  // Acknowledge action request
  await ack();
  await say('Request approved 👍');
});

app.action('datepicker_remind', async ({ body, ack, say }) => {
  // Acknowledge the action
  console.log(JSON.stringify(body))

  await ack();
  await say(`<@${body.user.id}> datepicker!!`);
});

app.action('button_click_custom', async ({ body, ack, say }) => {
  // Acknowledge the action
  console.log(JSON.stringify(body))

  // await ack();
  // await say(`<@${body.user.id}> clicked the button`);

  results = [{ label: "SI", value: true }, { label: "NO", value: false }]
  
  let options = [];
  for (const result of results) {
    options.push({
      "text": {
        "type": "plain_text",
        "text": result.label
      },
      "value": result.value
    });
  }

  console.log(" options ")
  console.log(JSON.stringify(options))

  await ack({
    "options": options
  });
});

app.command('/incidencia', async ({ ack, body, client }) => {
    // say() sends a message to the channel where the event was triggered
    await ack();

    try {
        // Call views.open with the built-in client
        const result = await client.views.open({
          // Pass a valid trigger_id within 3 seconds of receiving it
          trigger_id: body.trigger_id,
          // View payload
          view: {
            type: 'modal',
            callback_id: 'view_incident',
            title: {
              type: 'plain_text',
              text: 'Creador de incidencias'
            },
            blocks: [
              {
                type: "section",
                block_id: "incident_type_block",
                text: {
                  type: "mrkdwn",
                  text: "Selecciona el tipo de incidencia"
                },
              accessory: {
                action_id: "select_incident_type",
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Selecciona un item",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "Stripe",
                      emoji: true
                    },
                    value: "stripe"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "Comunicación",
                      emoji: true
                    },
                    value: "Comunication"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "Error técnico",
                      emoji: true
                    },
                    value: "tech-bug"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "CRM",
                      emoji: true
                    },
                    value: "crm"
                  }
                ]
              }
              },
              {
                type: 'input',
                block_id: 'block_incident',
                label: {
                  type: 'plain_text',
                  text: 'De que se trata la incidencia?'
                },
                element: {
                  type: 'plain_text_input',
                  action_id: 'incident_input',
                  multiline: true,
                  initial_value: body.text
                }
              }
            ],
            submit: {
              type: 'plain_text',
              text: 'Submit'
            }
          }
      });

      console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.view('view_incident', async ({ ack, body, view, client }) => {
  await ack();

  slackUserId = body.user.id
  requestChannel = "C02JDT4U615";

  await client.chat.postMessage({
    channel: requestChannel, // Obtener este channel id dinamicamente
    blocks: [{
        type: "header",
        text: {
          type: "plain_text",
          text: " :warning: Nueva incidencia creada "
        }
      },
      {
        type: "section",
        fields: [
          {
            "type": "plain_text",
            "text": view['state']['values']['block_incident']['incident_input']['value'],
            "emoji": true
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "plain_text",
            text: "*Created by:* <@${" + slackUserId + "}>"
          },
          {
            type: "plain_text",
            text: "*typo:*" + view['state']['values']['incident_type_block']['select_incident_type']['selected_option']['value']
          }
        ]
      }
    ]
  });
});

app.action('select_incident_type', async ({ body, ack, say }) => {
  await ack();
});

// ROUTES //
// Other web requests are methods on receiver.router
receiver.router.get('/incidentes', (req, res) => {
  // You're working with an express req and res now.
   // res.send('yay!');
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
