import DWebhook from '../module/dwebhook.js';
import DMessage from '../module/dmessage.js';

const browserAPI = chrome; // chrome || browser || window.browser || window.chrome;

if (browserAPI.webRequest && browserAPI.webRequest.onCompleted) {
  browserAPI.webRequest.onCompleted.addListener(
    async (details) => {
      if (details.url.includes('/api/v1/wargame/challenges/') && 
          details.url.includes('/auth/') && 
          details.method === 'POST') {
        
        const challengeId = details.url.match(/challenges\/(\d+)\/auth/)?.[1];
        if (!challengeId) return;

        if (details.statusCode >= 200 && details.statusCode < 300) {
          console.log('문제를 해결했습니다!');
          console.log('Challenge ID:', challengeId);
          
          // Discord 웹훅 전송
          const message = await DMessage.buildSolvedMessage(challengeId);
          await DWebhook.sendToAll(message);
        } else {
          console.log('문제를 해결하지 못했습니다.');
        }
      }
    },
    {
      urls: ["https://dreamhack.io/api/v1/wargame/challenges/*/auth/"],
      types: ["xmlhttprequest"]
    }
  );
}