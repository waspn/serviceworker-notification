import { INotificationContent } from '../interface/NotificationInterface'

const content: INotificationContent = { body: "You got a new updated", icon: 'assets/150.jpg', tag: "dismiss-by-user", requireInteraction: true }
let notify: Notification

window.addEventListener('load', (event: Event) => {
  checkPermission()
})

function checkPermission(): void {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    initializeNotification()
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission: NotificationPermission) => {
      if (Notification.permission === 'granted') {
        initializeNotification()
      }
    })
  }
}

function initializeNotification(): void {
  const notifyButton: Element = document.getElementById('notifyButton');

  notifyButton.addEventListener('click', (event) => {
    notify = new Notification('Notification', content)
    notify.onshow = (event) => { handleTimeout(event) }
    notify.onclick = (event) => { handleOnclick(event) }
    notify.onclose = (event) => { handleOnclose(event) }
    notify.onerror = (event) => { handleError(event) }
  })
}

function handleTimeout(event: Event): void {
  console.time('closed in');
  if (content.timeout) {
    setTimeout(() => { notify.close() }, content.timeout)
  }
}

function handleOnclick(event: Event): void {
  if (content.url) {
    window.open(content.url)
  }
}

function handleOnclose(event: Event): void {
  console.timeEnd('closed in');
}

function handleError(event: Event): void {
  console.log('ERROR OCCURED');
}