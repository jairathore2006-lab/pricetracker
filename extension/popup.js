document.addEventListener('DOMContentLoaded', async () => {
  const titleEl = document.getElementById('page-title');
  const priceEl = document.getElementById('detected-price');
  const storeEl = document.getElementById('best-store');
  const statusEl = document.getElementById('deal-status');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      titleEl.textContent = 'PriceWise Smart Assistant';
      priceEl.textContent = 'Ready';
      storeEl.textContent = 'Open Amazon/Flipkart';
      return;
    }

    const url = tab.url.toLowerCase();
    let retailer = '';
    if (url.includes('amazon.in')) retailer = 'Amazon India';
    else if (url.includes('flipkart.com')) retailer = 'Flipkart';
    else if (url.includes('croma.com')) retailer = 'Croma';
    else if (url.includes('reliancedigital.in')) retailer = 'Reliance Digital';
    else if (url.includes('vijaysales.com')) retailer = 'Vijay Sales';
    else if (url.includes('tatacliq.com')) retailer = 'Tata CLiQ';

    if (retailer) {
      titleEl.textContent = tab.title ? tab.title.substring(0, 60) + '...' : `${retailer} Product`;
      priceEl.textContent = 'Live Tracking';
      storeEl.textContent = `Active on ${retailer}`;
      statusEl.textContent = '✓ Multi-Store Compare Available';
    } else {
      titleEl.textContent = 'Browse any product on Amazon, Flipkart or Croma to compare prices!';
      priceEl.textContent = 'Standby';
      storeEl.textContent = '6 Stores Supported';
    }
  } catch (e) {
    titleEl.textContent = 'PriceWise Online Assistant';
  }
});
