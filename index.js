require('dotenv').config()
const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');

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

// Listens to incoming messages that contain "hello"
// app.message('hello', async ({ message, say }) => {
//     // say() sends a message to the channel where the event was triggered
//     await say(`Hey there <@${message.user}>!`);
// });

// app.message('hola', async ({ message, say }) => {
//     // say() sends a message to the channel where the event was triggered
//     console.log(JSON.stringify(message));

//     await say(`Hola caricachupas <@${message.user}>!`);
//     await say(`Hola caricachupas <@${message.channel}>!`);
//     await say(`Hola caricachupas <@${message.channel_type}>!`);
// });

app.message('pipe', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    
    await say(`Hola pipe <@${message.user}>!`);
});

/*
app.command('/incidencia', async ({ ack, body, client }) => {
    // say() sends a message to the channel where the event was triggered
    await ack();

    console.log(body.text)

    try {
        // Call views.open with the built-in client
        const result = await client.views.open({
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: body.trigger_id,
        // View payload
        view: {
            type: 'modal',
            // View identifier
            callback_id: 'view_1',
            title: {
            type: 'plain_text',
            text: 'Modal title'
            },
            blocks: [
            {
                type: 'section',
                text: {
                type: 'mrkdwn',
                text: 'Welcome to a modal with _blocks_'
                },
                accessory: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'Click me!'
                },
                action_id: 'button_abc'
                }
            },
            {
                type: 'input',
                block_id: 'input_c',
                label: {
                type: 'plain_text',
                text: 'What are your hopes and dreams?'
                },
                element: {
                type: 'plain_text_input',
                action_id: 'dreamy_input',
                multiline: true
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
*/
app.message(/(incidencia|ayuda|problema).*/, async ({ message, say }) => {
    await say({
    blocks:  [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "INCIDENCIA!"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Hola <@${message.user}>. Parece que quieres crear una incidencia.`
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Dale",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "button-action"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `> ${message.text}`
			}
		}
	],
        text: `${message.text} <#${message.channel}>`
    });
});

app.action('button-action', async ({ body, ack, say }) => {
// Acknowledge the action
    await ack();
    await say(`Creada incidencia:
    ${body.message.text}`);
});