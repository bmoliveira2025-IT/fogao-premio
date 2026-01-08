"use client";

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { Bell, BellOff } from 'lucide-react';

// Firebase Client Config (Public)
// We need to re-initialize explicitly here because we need the messaging instance on the client
const firebaseConfig = {
    apiKey: "AIzaSyDARXxRCxKoAU_SeEyxRp1uXPR0roOVm7Y",
    authDomain: "coastal-epigram-392314.firebaseapp.com",
    projectId: "coastal-epigram-392314",
    storageBucket: "coastal-epigram-392314.firebasestorage.app",
    messagingSenderId: "526525338401",
    appId: "1:526525338401:web:626a18b11f492d9294e460",
    measurementId: "G-33MNNN57SE"
};

export default function NotificationManager() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if running in browser and if Notification/SW is supported
        if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
            setIsSupported(true);
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!isSupported) return;

        try {
            const permissionResult = await Notification.requestPermission();
            setPermission(permissionResult);

            if (permissionResult === 'granted') {
                await subscribeToTopic();
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
        }
    };

    const subscribeToTopic = async () => {
        try {
            const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
            const messaging = getMessaging(app);

            // Get FCM Token
            // Use VAPID key if you have generated one, but often fine without for basic FCM
            // If you have a specific VAPID Key pair generated in cloud messaging settings, put it here.
            // For now we'll try without, relying on default FCM config.
            // NOTE: "vapidKey" is usually required for web push (unless using default firebase-messaging-sw setup)
            // I will assume the default one or user needs to add it later.
            // Actually, for it to work reliably, we usually need a VAPID key. 
            // I'll leave it empty. Cloud Messaging often works with just messagingSenderId.
            // NOTE: Para funcionar, você PRECISA da VAPID KEY do Firebase Console:
            // Configurações do Projeto -> Cloud Messaging -> Web Push certificates
            const currentToken = await getToken(messaging, {
                vapidKey: 'L8WId3EFmoOAZVaGAA2XtYlE1HOgX11x2Lbj8gb4fPQ'
            });

            if (currentToken) {
                console.log('✅ FCM Token Gerado:', currentToken);
                // Send to our backend to subscribe to 'news' topic
                const response = await fetch('/api/notifications/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: currentToken }),
                });

                if (response.ok) {
                    alert("✅ Notificações ativadas com sucesso! Você receberá alertas das principais notícias.");
                    setPermission('granted');
                } else {
                    console.error('Falha ao enviar token para o servidor');
                }
            } else {
                console.warn('Nenhum token FCM disponível. Verifique as permissões.');
            }
        } catch (err) {
            console.log('An error occurred while retrieving token. ', err);
        }
    };

    if (!isSupported) return null;

    // Don't show if already granted (or maybe show a small 'active' icon?)
    if (permission === 'granted') return null;

    return (
        <button
            onClick={requestPermission}
            className="fixed bottom-20 right-4 z-40 bg-zinc-900 border border-premium-gold/30 text-premium-gold p-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce hover:bg-zinc-800 transition-colors"
            title="Ativar Notificações"
        >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-bold uppercase hidden md:inline">Alertas</span>
        </button>
    );
}
