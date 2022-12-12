chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_PAGE') {
    const pageContent = document.body.textContent;
    if (pageContent.includes('script')) {
      chrome.runtime.sendMessage({ type: 'FOUND_SCRIPT' });
    }
  }
});