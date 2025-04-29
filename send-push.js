
import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BNuQspCjBXXU5r3sVByYETIvUFA5Knt4m5pF1OpPYOrMEJmRMX3ZXom35P0Qdc7tclacpgWiE5vZsd8cdAyyFD8',
  privateKey: 'CI7U5o6Qr1Dmk8o6sfWyDdvlFZ6Pr2MIZ4kMHprqkV0'
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function handler(event) {
  const subscription = JSON.parse(event.body);
  const payload = JSON.stringify({
    title: subscription.title || 'Collector Issue',
    body: subscription.body || 'A collector has reported an issue.'
  });

  try {
    await webpush.sendNotification(subscription, payload);
    return { statusCode: 200, body: 'Push sent' };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
