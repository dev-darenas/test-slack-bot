const SLACK_SIGNING_SECRET=""
const SLACK_BOT_TOKEN=""
const SLACK_APP_TOKEN=""
const { App } = require('@slack/bolt');
const IncidentService = require('./services/incidentServices.js');

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
app.message('hola santi', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log(message);
    await say(`Hey there Santi <@${message.user}>!`);
});

app.message('Hilo', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    var threadTs;
    if(message.thread_ts){
        threadTs = message.thread_ts; 
    }else{
        threadTs=message.ts;
    }
    console.log(JSON.stringify(message));
    await say({text:`<@${message.user}> Hello`,thread_ts:threadTs});
});

app.message('caricachupa cerrar', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    var threadTs;
    if(message.thread_ts){
        threadTs = message.thread_ts; 
    }
    else{
        threadTs=message.ts;
    }
    console.log(JSON.stringify(message));
    


    try {
        // Call the conversations.history method using the built-in WebClient
        const result = await app.client.conversations.replies({
          // The token you used to initialize your app
          token: SLACK_BOT_TOKEN,
          // In a more realistic app, you may store ts data in a db
          ts: threadTs,
          channel: message.channel
            
        });

        // Call the conversations.history method using the built-in WebClient
        const link = await app.client.chat.getPermalink({
        // The token you used to initialize your app
        token: SLACK_BOT_TOKEN,
        // In a more realistic app, you may store ts data in a db
        message_ts: result.messages[0].ts,
        channel: message.channel            
        });

        await say({text:`<@${message.user}> Tu caso fue cerrado ${link.permalink}`,});

        // There should only be one result (stored in the zeroth index)
       
        // Print message text
        console.log(result);
        console.log('p::::::::::::::::::::::::P');
        console.log(link);

        const incidentService = new IncidentService();

        const closeIncident = await incidentService.closeIncident({ 
            created_ts_id: result.messages[0].ts, 
            close_user_slack: message.user, 
            messages_slack: result.messages,

         });

         console.log(':::::::::::::::::::::::::::');
         console.log(JSON.stringify(closeIncident));

        await say({text:`<@${message.user}> Caso cerrado`,thread_ts:threadTs, blocks : [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Carachupa",
                    "emoji": true
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Incedente cr por :<@${message.user}>`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Excelente que me notificaste, carechupa se pone feliz."
                },
                "accessory": {
                    "type": "image",
                    "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
                    "alt_text": "cute cat"
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
            }
        ]});
      }
      catch (error) {
        console.error(error);
      }
    
});



app.message('Sanco', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log(JSON.stringify(message));
    console.log(JSON.stringify(say));

    await say({ text: 'PONG', thread_ts: message.ts });
});

app.command('/h_incidente', async ({ ack, body, client }) => {
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
            // View  identifier
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
                text: 'Hola to a modal with _blocks_'
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

// Handle a view_submission request
app.view('view_1', async ({ ack, body, view, client , say}) => {
    // Acknowledge the view_submission request
    await ack();
  
    // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verifcation of their submission
    console.log(JSON.stringify(view));
    console.log(JSON.stringify(body));
    console.log(JSON.stringify(client));
    // Assume there's an input block with `block_1` as the block_id and `input_a`
    const val = view['state']['values']['input_c']['dreamy_input']['value'];
    const user = body['user']['id'];
  
    // Message to send user
    let msg = '';
    // Save to DB
    const results = true;
  
    if (results) {
      // DB save was successful
      msg = 'Creaste una incedencia';
    } else {
      msg = 'There was an error with your submission';
    }
  
    // Message the user
    try {
    let message =  await client.chat.postMessage({
        channel: 'C02JMB2RD62',
        text: ` <@${user}>! Creo esta incidencia desde el modal ${val}`,
        blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Incedente creado por :<@${user}>! \n\n<https://example.com|View ${val}>`
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Por favor selecciona la priodad"
                    },
                    "accessory": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Prioridad :fire_extinguisher:",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Alta",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Media",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Baja",
                                    "emoji": true
                                },
                                "value": "value-2"
                            }
                        ],
                        "action_id": "static_select-action"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Responbale"
                    },
                    "accessory": {
                        "type": "users_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Opcional",
                            "emoji": true
                        },
                        "action_id": "users_select-action"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Plataforma"
                    },
                    "accessory": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Opcional",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "SobrePlanos",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Salesforce",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Hubspot",
                                    "emoji": true
                                },
                                "value": "value-2"
                            }
                        ],
                        "action_id": "static_select-action"
                    }
                },
                {
                    "type": "divider"
                }
        ]
      });
      console.log(':::::::::::::::::::::::::::');
      console.log(JSON.stringify(message));
        
      const incidentService = new IncidentService();
      let ts = message.message.ts;
      let channel = message.channel;
      let newuser = body.user.id;


    // Call the conversations.history method using the built-in WebClient
    const link = await app.client.chat.getPermalink({
        // The token you used to initialize your app
        token: SLACK_BOT_TOKEN,
        // In a more realistic app, you may store ts data in a db
        message_ts: ts,
        channel: channel            
        });


      let newPermalink = link.permalink;
      
      const createdIncident = await incidentService.createIncident({ 
        newCreated_ts: ts, 
        NewUser: newuser, 
        NewPermalink: newPermalink,
        NewChannel: channel
     });

      console.log(':::::::::::::::::::::::::::');
      console.log(JSON.stringify(createdIncident));
    }
    catch (error) {
      console.error(error);
    }
  
  });



// Listen for a button invocation with action_id `button_abc` (assume it's inside of a modal)
app.action('button_abc', async ({ ack, body, client}) => {
    // Acknowledge the button request
    await ack();
  
    try {
      // Call views.update with the built-in client
      const result = await client.views.update({
        // Pass the view_id
        view_id: body.view.id,
        // Pass the current hash to avoid race conditions
        hash: body.view.hash,
        // View payload with updated blocks
        view: {
          type: 'modal',
          // View identifier
          callback_id: 'view_1',
          title: {
            type: 'plain_text',
            text: 'Updated modal'
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: 'You updated the modal!'
              }
            },
            {
              type: 'image',
              image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
              alt_text: 'Yay! The modal was updated'
            }
          ]
        }
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  });