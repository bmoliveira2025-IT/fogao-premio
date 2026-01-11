importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyAmWOTIPqRaP-YWwhPElY6fPh9DAeFcp-c",
    authDomain: "strive-bra.firebaseapp.com",
    projectId: "strive-bra",
    storageBucket: "strive-bra.firebasestorage.app",
    messagingSenderId: "112700432380",
    appId: "1:112700432380:web:90f802159ddf7ad4bc1c79"
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
