class DWebhook {
  static async send(webhookUrl, content) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Discord webhook 전송 실패:', error);
      return false;
    }
  }

  static async sendToAll(content) {
    const browserAPI = chrome;
    
    try {
      const result = await browserAPI.storage.sync.get(['webhooks']);
      const webhooks = result.webhooks || [];
      
      const promises = webhooks.map(webhook => this.send(webhook, content));
      await Promise.all(promises);
      
      return true;
    } catch (error) {
      console.error('Discord webhooks 전송 실패:', error);
      return false;
    }
  }
}

export default DWebhook;
