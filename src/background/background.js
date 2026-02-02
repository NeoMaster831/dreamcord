import { sendToAll } from '../module/dwebhook.js';
import { buildSolvedMessage } from '../module/dmessage.js';

const browserAPI = chrome; // chrome || browser || window.browser || window.chrome;

if (browserAPI.webRequest?.onCompleted) {
  browserAPI.webRequest.onCompleted.addListener(
    async (details) => {
      if (details.url.includes('/api/v1/wargame/challenges/') &&
          details.url.includes('/auth/') &&
          details.method === 'POST') {

        const challengeId = details.url.match(/challenges\/(\d+)\/auth/)?.[1];
        if (!challengeId) return;

        if (details.statusCode >= 200 && details.statusCode < 300) {
          const message = await buildSolvedMessage(challengeId, details.tabId, false);
          await sendToAll(message);
        }
      }
    },
    {
      urls: ["https://dreamhack.io/api/v1/wargame/challenges/*/auth/"],
      types: ["xmlhttprequest"]
    }
  );
}