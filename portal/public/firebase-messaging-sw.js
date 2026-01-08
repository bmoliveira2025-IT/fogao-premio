importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDARXxRCxKoAU_SeEyxRp1uXPR0roOVm7Y",
    authDomain: "coastal-epigram-392314.firebaseapp.com",
    projectId: "coastal-epigram-392314",
    storageBucket: "coastal-epigram-392314.firebasestorage.app",
    messagingSenderId: "526525338401",
    appId: "1:526525338401:web:626a18b11f492d9294e460",
    measurementId: "G-33MNNN57SE"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png', // Low res icon
        badge: '/icon.png', // Small monochrome icon for status bar
        image: payload.notification.image, // Big image
        tag: 'news-alert',
        data: {
            url: payload.data?.url || '/'
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    console.log('[firebase-messaging-sw.js] Notification click Received.', event);
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
