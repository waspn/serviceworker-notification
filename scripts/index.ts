import { ServiceWorkerEvent } from "./notification";

const notificationContent = require('../../assets/temp.js')
let notifyButton: HTMLElement = undefined;
const activateNotifyButton = (registeredWorker: ServiceWorkerRegistration): void => {
    notifyButton.addEventListener('click', (event) => {
        if (registeredWorker.active) {
            registeredWorker.active.postMessage({
                message: 'trigger-notify',
                content: notificationContent
            });
        }
    })
}

if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => {
        notifyButton = document.getElementById('notifyButton');
        navigator.serviceWorker.register('notification.js')
            .then((registeredWorker: ServiceWorkerRegistration) => {
                if (!('Notification' in window)) {
                    alert('This browser does not support desktop notification');
                } else if (Notification.permission === 'granted') {
                    activateNotifyButton(registeredWorker);
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then((permission: NotificationPermission) => {
                        if (Notification.permission === 'granted') {
                            activateNotifyButton(registeredWorker);
                        }
                    })
                }
            })
            .catch((err) => { console.log('ERROR', err); });

        navigator.serviceWorker.addEventListener('controllerchange', (event: ServiceWorkerEvent) => {
            if (event.target.controller.state) {
                window.location.reload();
            }
        });

        navigator.serviceWorker.addEventListener('message', (event: ServiceWorkerEvent) => {
            const { message, hasSound } = event.data
            if (message === 'got-notify' && hasSound) {
                const audio = new Audio('notify.wav');
                audio.play();
            }
        });
    })
}
