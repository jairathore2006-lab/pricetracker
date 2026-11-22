// PriceWise Content Script
// Injects a floating deal assistant badge when browsing product pages

(function () {
  const host = window.location.hostname.toLowerCase();
  const isShoppingSite =
    host.includes('amazon.in') ||
    host.includes('flipkart.com') ||
    host.includes('croma.com') ||
    host.includes('reliancedigital.in');

  if (!isShoppingSite) return;

  // Prevent multiple badges
  if (document.getElementById('pricewise-extension-pill')) return;

  const pill = document.createElement('div');
  pill.id = 'pricewise-extension-pill';
  pill.innerHTML = `
    <div class="pw-badge">
      <div class="pw-icon">📉</div>
      <div class="pw-text">
        <span class="pw-brand">PriceWise</span>
        <span class="pw-sub">Shop Smart. Save More.</span>
      </div>
      <button class="pw-btn" id="pw-open-app">Compare Deals →</button>
    </div>
  `;

  document.body.appendChild(pill);

  document.getElementById('pw-open-app')?.addEventListener('click', () => {
    window.open('http://localhost:3000', '_blank');
  });
})();
