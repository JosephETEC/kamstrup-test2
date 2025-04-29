
const publicVapidKey = 'BNuQspCjBXXU5r3sVByYETIvUFA5Knt4m5pF1OpPYOrMEJmRMX3ZXom35P0Qdc7tclacpgWiE5vZsd8cdAyyFD8';

async function subscribeUser() {
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    console.log('Permission denied');
    return;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await fetch('/.netlify/functions/send-push', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    subscribeUser();
  }
});
