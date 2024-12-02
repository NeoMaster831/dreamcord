document.addEventListener('DOMContentLoaded', () => {
  const webhooksList = document.getElementById('webhooks-list');
  const addWebhookButton = document.getElementById('add-webhook');

  // 웹훅 목록 불러오기
  function loadWebhooks() {
    chrome.storage.sync.get(['webhooks'], (result) => {
      webhooksList.innerHTML = '';
      const webhooks = result.webhooks || [];
      
      webhooks.forEach((webhook, index) => {
        addWebhookItem(webhook, index);
      });
    });
  }

  // 웹훅 항목 HTML 생성
  function addWebhookItem(webhookUrl = '', index) {
    const webhookItem = document.createElement('div');
    webhookItem.className = 'webhook-item';
    webhookItem.innerHTML = `
      <input type="text" class="webhook-url" placeholder="https://discord.com/api/webhooks/..." value="${webhookUrl}">
      <button class="save-button">저장</button>
      <button class="delete-button">×</button>
    `;

    const input = webhookItem.querySelector('.webhook-url');
    const saveButton = webhookItem.querySelector('.save-button');
    const deleteButton = webhookItem.querySelector('.delete-button');

    // 저장 버튼 이벤트
    saveButton.addEventListener('click', () => {
      chrome.storage.sync.get(['webhooks'], (result) => {
        const webhooks = result.webhooks || [];
        webhooks[index] = input.value;
        chrome.storage.sync.set({ webhooks }, () => {
          alert('웹훅이 저장되었습니다!');
        });
      });
    });

    // 삭제 버튼 이벤트
    deleteButton.addEventListener('click', () => {
      chrome.storage.sync.get(['webhooks'], (result) => {
        const webhooks = result.webhooks || [];
        webhooks.splice(index, 1);
        chrome.storage.sync.set({ webhooks }, () => {
          loadWebhooks();
        });
      });
    });

    webhooksList.appendChild(webhookItem);
  }

  // 새 웹훅 추가 버튼 이벤트
  addWebhookButton.addEventListener('click', () => {
    chrome.storage.sync.get(['webhooks'], (result) => {
      const webhooks = result.webhooks || [];
      addWebhookItem('', webhooks.length);
    });
  });

  // 초기 웹훅 목록 로드
  loadWebhooks();
}); 