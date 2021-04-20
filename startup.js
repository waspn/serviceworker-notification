const fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')
const notifyContent = [
  // dataset follow to each requirement.

  /* #1 A user wants to see a notification */
  { reqId: 1, body: 'You got a new updated' },

  /* #2 A user wants to see a notification until it is dismissed */
  {
    reqId: 2,
    body: 'You got a new updated'
  },
  {
    reqId: 2.1,
    body: 'You got a new timeout',
    tag: 'timeout',
    requireInteraction: true,
    timeout: 5000
  },
  /* #3 A user wants to dismiss a notification  */
  {
    reqId: 3,
    body: 'You got a new updated',
    tag: 'dismiss-by-user',
    requireInteraction: true,
  },

  /* #4 A user wants to see a notification with a custom icon */
  {
    reqId: 4,
    body: 'You got a new updated',
    tag: 'notify',
    icon: '150.jpg',
    requireInteraction: true
  },

  /* #5 A user wants to interact with the notification */
  {
    reqId: 5,
    body: 'You got a new updated',
    icon: '150.jpg',
    tag: 'notify',
    requireInteraction: true,
    renotify: true,
    actions: [
      { action: 'open_app', title: 'OK' },
      { action: 'cancel', title: 'Cancel' },
    ]
  },

  /* #6 A user wants to be navigated to a specific part of the application that is associated with the notification */
  {
    reqId: 6,
    body: 'You got a new updated',
    icon: '150.jpg',
    tag: 'notify',
    data: { link: 'https://www.google.com' },
    requireInteraction: true,
    renotify: true,
    actions: [
      { action: 'view_details', title: 'View details' },
      { action: 'cancel', title: 'Cancel' },
    ]
  },
  {
    reqId: 6.1,
    body: 'You got a new message from John',
    icon: '150.jpg',
    tag: 'notify',
    requireInteraction: true,
    renotify: true,
    actions: [
      {
        action: "reply",
        type: "text",
        title: "Reply",
      },
      { action: 'cancel', title: 'Cancel' }
    ]
  },

  /* #9	A user wants to have a custom sound for a notification */
  {
    reqId: 9,
    body: 'You got a new updated',
    icon: '150.jpg',
    tag: 'notify',
    requireInteraction: true,
    silent: true,
    renotify: true,
    actions: [
      { action: 'view_task', title: 'View task' },
      { action: 'cancel', title: 'Cancel' },
    ]
  },

  /* #12 A user wants to see a notification with associated media, i.e. a picture or a gif */
  {
    reqId: 12,
    body: 'You got a new updated',
    image: '150.jpg',
    tag: 'notify',
    requireInteraction: true,
    silent: true,
    renotify: true,
    actions: [
      { action: 'ok', title: 'OK' },
      { action: 'cancel', title: 'Cancel' },
    ]
  }
]

const numInput = process.argv[2]
const content = notifyContent.find(content => content.reqId === Number(numInput))

if (content !== undefined) {
  console.log('RES', content)
  fs.writeFileSync('assets/temp.js', `module.exports=${JSON.stringify(content)}`, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  })
  console.log('App is starting...');
  shell.exec(`npm run start-web`);

} else {
  console.log('404 Content not found.');
  console.log('There might be some error.');
}
