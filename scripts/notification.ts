export interface ServiceWorkerEvent extends Event {
    target: any
    data?: any
    waitUntil?: any
    action?: string
    reply?: string
    notification?: Notification
}

interface RegisteredServiceWorker extends ServiceWorkerRegistration {
    skipWaiting: any
    clients: any
    registration: any
}

declare const self: RegisteredServiceWorker

const WORKER_CACHE: string = 'worker-v1';
const getActionUrl = (actionName: string): string => {
    switch (actionName) {
        case 'open_app':
            return 'https://github.com/waspn'
        case 'view_details':
            return 'https://github.com/redux-utilities/flux-standard-action'
        case 'view_task':
            return 'https://docs.microsoft.com/en-us/cpp/atl/using-task-manager?view=msvc-160'
        default: return 'https://en.wikipedia.org/wiki/HTTP_404'
    }
}


self.addEventListener('install', (event: ServiceWorkerEvent) => {
    self.skipWaiting()
    event.waitUntil(caches.open(WORKER_CACHE).then(cache => cache.add('notification.js')));
});
self.addEventListener('activate', (event: ServiceWorkerEvent) => {
    const getCacheKeys = async () => {
        const cacheKeys = await caches.keys()
        cacheKeys.map(key => {
            if (key !== WORKER_CACHE) {
                return caches.delete(key)
            }
        })
        await self.clients.claim()
    }
    event.waitUntil(getCacheKeys())
});
self.addEventListener('fetch', (event: ServiceWorkerEvent) => {
});
self.addEventListener('message', async (event: ServiceWorkerEvent) => {
    const { message, content } = event.data
    if (message === 'trigger-notify') {
        const clients: Array<any> = await self.clients.matchAll()
        clients.forEach(client => client.postMessage({ message: 'got-notify', hasSound: content.silent }))
        await self.registration.showNotification('Notification', content)
        try {
            const allNotifications = await self.registration.getNotifications()
            const latestNotification = allNotifications[allNotifications.length - 1]
            if (content.timeout) {
                setTimeout(() => {
                    const notification = allNotifications.find(notify => notify.tags === content.tag) || latestNotification
                    notification.close()
                }, content.timeout)
            }
        } catch (error) {
            console.log('ERR', error)
        }
    }
});
self.addEventListener('notificationclick', (event: ServiceWorkerEvent) => {
    event.notification.close();
    const hasAction = Boolean(event.action)
    if (hasAction) {
        if (event.action === 'reply') {
            console.log('Reply back with message', event.reply)
        } if (event.action === 'cancel') {
            console.log('Cancel')
        } else {
            self.clients.openWindow(getActionUrl(event.action))
                .then((res: any) => { console.log('Open App', res) })
                .catch((err: Error) => { console.log('Cannot open deeplink', err) })
        }
    } else {
        if (event.notification.data) {
            self.clients.openWindow(event.notification.data.link)
                .then((res) => { console.log('Open App', res); })
                .catch((err) => { console.log('Cannot open onclick deeplink', err); });
        }
    }
});