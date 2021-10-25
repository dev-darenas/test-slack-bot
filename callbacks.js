const trackerLink = 'http://lalala.com'

const modalCallback = async ({ ack, body, client, context }) => {
    // say() sends a message to the channel where the event was triggered
    await ack();

    const message = body?.message?.text || body?.text
    const channel = body.channel
    console.log(channel)

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
                block_id: "channel_block",
                text: {
                  type: "mrkdwn",
                  text: "Selecciona el canal"
                },
                accessory: {
                  action_id: "select_channel",
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
                        text: channel.name,
                        emoji: true
                      },
                      value: channel.id
                    }
                  ],
                  initial_option: {
                      text: {
                        type: "plain_text",
                        text: channel.name,
                        emoji: true
                      },
                      value: channel.id
                    }
                }
              },
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
                  text: '¿De qué trata la incidencia?'
                },
                element: {
                  type: 'plain_text_input',
                  action_id: 'incident_input',
                  multiline: true,
                  initial_value: message
                }
              }
            ],
            submit: {
              type: 'plain_text',
              text: 'Crear'
              // Callback para crear
            }
          }
      });
      console.log(result);
  } catch (error) {
    console.error(error);
  }
}

const languageCallback = async ({ message, say, context, next }) => {
    await say({
        blocks:  
        [
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text": "*Detección de incidencia*"
              }
          },
          {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `Hola <@${message.user}>, parece que quieres crear una incidencia.`
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "OK",
                    "emoji": true
                },
                "value": "create",
                "action_id": "create_incident_action"
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
        text: `${message.text}`
    });
}

const viewIncidentCallback = async ({ ack, body, view, client, say}) => {
    // Acknowledge the view_submission request
    await ack();
  
    // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verifcation of their submission
    // console.log(JSON.stringify(view));
    // console.log(JSON.stringify(body));
    // console.log(JSON.stringify(client));
    // Assume there's an input block with `block_1` as the block_id and `input_a`

    const val = view['state']['values']['block_incident']['incident_input']['value'];
    const type = view['state']['values']['incident_type_block']['select_incident_type']['selected_option']?.value
    const user = body['user']['id'];
    const channel = {
      name: view.state.values.channel_block.select_channel.selected_option.text.text,
      id: view.state.values.channel_block.select_channel.selected_option.value
    }
  
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
      await client.chat.postMessage({
        channel: channel.id,
        text: `<@${user}> creó esta incidencia.`,
        blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Incidente creado por: <@${user}>\n\n<${trackerLink}|Ver>`
                    }
                },
                {
                  "type": "section",
                  "text": {
                      "type": "mrkdwn",
                      "text": val
                  },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Por favor selecciona la prioridad"
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
    }
    catch (error) {
      console.error(error);
    }
  }

const reactionCallback = async ({ event, say }) => {
  switch (event.reaction) {
    case 'calendar':
      await say({
        blocks: [{
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Selecciona una fecha para recordarte"
          },
          "accessory": {
            "type": "datepicker",
            "action_id": "datepicker_remind", // faltaría crear esta acción
            "initial_date": "2019-04-28",
            "placeholder": {
              "type": "plain_text",
              "text": "Selecciona una fecha"
            }
          }
        }]
      });
    break;
    case 'eyes':
      // ejecutar la lógica de seguimiento -- agregar a una db
      await say({
        text: `Tu incidente ya esta siendo mirado por <@${event.user}>`,
        thread_ts: event.item.ts
      })
    break;
  }
}

const datePickerCallback = async ({ body, ack, say }) => {
  // Acknowledge the action
  console.log(JSON.stringify(body))

  await ack();
  await say(`<@${body.user.id}> se ha agregado un recordatorio`);
}

const closeIncidentCallback = async ({ message, say, shortcut, client }) => {
    // say() sends a message to the channel where the event was triggered
    const actualMessage = shortcut ? shortcut.message : message
    const actualChannel = shortcut ? shortcut.channel.id : message.channel
    const threadTs = actualMessage.thread_ts || actualMessage.ts;

    console.log("++++++", threadTs)

    console.log(JSON.stringify(actualMessage));
    
    try {
        // Call the conversations.history method using the built-in WebClient
        const result = await client.conversations.replies({
          // The token you used to initialize your app
          token: process.env.SLACK_BOT_TOKEN,
          // In a more realistic app, you may store ts data in a db
          ts: threadTs,
          channel: actualChannel
        });
    
        // There should only be one result (stored in the zeroth index)
       
        // Print message text
        console.log(result);

        await say({
          text:`<@${actualMessage.user}> Incidente cerrado`, 
          thread_ts: threadTs, 
          blocks : [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Cerrar incidencia",
                    "emoji": true
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Incidente creado por: <@${actualMessage.user}>`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "¿Qué podríamos poner aquí? ¿Eh?"
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
                    "text": "Solución del incidente :computer::",
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
                  "value": threadTs,
                  "action_id": "close_incident"
                }
              ]
            }
        ]});
      }
      catch (error) {
        console.error(error);
      }
}

const closeActionCallback = async ({ body, ack, say, message }) => {
  await ack();
  await say({ text: 'Incidencia cerrada 👍', thread_ts: body.message.thread_ts });
}

const plainTextInputCallback = async () => {

}

const selectInputCallback = async ({ body, ack, say }) => {
  await ack();
}

module.exports = { 
  modalCallback,
  languageCallback,
  viewIncidentCallback,
  datePickerCallback,
  reactionCallback,
  plainTextInputCallback,
  closeIncidentCallback,
  closeActionCallback,
  selectInputCallback
}