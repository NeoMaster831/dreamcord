window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== "PROFILE_REQUEST") return;
  
  const me = window.__NUXT__?.state?.me;
  console.log(me);
  const payload = {
    introduction: me?.additional_profile?.introduction,
    nickname: me.nickname,
    id: me.id,
    profile_image: me.profile_image,
  };
  window.postMessage({
    type: "PROFILE_RESPONSE",
    id: event.data?.id,
    payload
  }, location.origin);
});
