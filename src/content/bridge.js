function getProfile() {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    function onMessage(event) {
      if (event.source !== window) return;
      if (event.data?.type !== "PROFILE_RESPONSE") return;
      if (event.data?.id !== id) return;

      window.removeEventListener("message", onMessage);
      resolve(event.data.payload);
    }

    window.addEventListener("message", onMessage);
    window.postMessage({ type: "PROFILE_REQUEST", id }, "*");

    setTimeout(() => {
      window.removeEventListener("message", onMessage);
      reject(new Error("timeout"));
    }, 2000);
  });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message?.type !== "PROFILE_REQUEST") return;
  sendResponse(await getProfile());
});
