chrome.webRequest.onCompleted.addListener(
  (details) => {
    // Dreamhack API 요청 감지 및 처리 로직 구현 예정
  },
  { urls: ["https://dreamhack.io/*"] }
); 