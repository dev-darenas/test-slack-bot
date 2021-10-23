const SLACK_SIGNING_SECRET="72c54907b6c9077acee2683a12bf42ca"
const SLACK_BOT_TOKEN="xoxb-2652709298097-2640443271139-5pE9IW6YajXq8dzgFkjQIX36"
const SLACK_APP_TOKEN="xapp-1-A02JWJVS1PE-2640452011139-eac608a1c6a872432f352a5358a8279beb503626fce4bee50b620395497c5fd3"

const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN 
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
});

app.message('hola', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log(JSON.stringify(message));

    await say(`Hola caricachupas <@${message.user}>!`);
    await say(`Hola caricachupas <@${message.channel}>!`);
    await say(`Hola caricachupas <@${message.channel_type}>!`);
});

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

app.message('block-caricachupa', async ({ message, say }) => {
    await say({
    blocks: [
        {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `Hey there <@${message.user}>!`
        },
        "accessory": {
            "type": "button",
            "text": {
            "type": "plain_text",
            "text": "Click Me"
            },
            "action_id": "button_click"
        }
        }
    ],
        text: `Hey there <@${message.user}>!`
    });
});

app.action('button_click', async ({ body, ack, say }) => {
// Acknowledge the action
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});