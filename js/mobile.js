/**
 * SwasthyaSetu — Mobile Web Browser & PWA Integration Engine
 * Manages service worker registration, mobile bottom dock navigation,
 * mobile drawer sheet, and QR Code generation for local Wi-Fi mobile testing.
 */

const MobileWeb = {
  localNetworkUrl: "http://192.168.0.176:8085",

  init() {
    this.registerServiceWorker();
    this.bindDockEvents();
    this.generateMobileQRCode();
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.'))) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('[Mobile PWA] ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[Mobile PWA] ServiceWorker registration skipped/failed:', err);
          });
      });
    }
  },

  bindDockEvents() {
    document.querySelectorAll('.dock-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        this.setActiveDockItem(tab);
        if (window.App) window.App.switchTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Mobile Drawer "More" button
    const moreBtn = document.getElementById('dock-more-btn');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => this.openMobileDrawer());
    }

    // Close drawer on backdrop tap
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeMobileDrawer();
      });
    }

    // Drawer item clicks
    document.querySelectorAll('.drawer-card-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.closeMobileDrawer();
        if (window.App) window.App.switchTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  },

  setActiveDockItem(tab) {
    document.querySelectorAll('.dock-item').forEach(d => {
      d.classList.toggle('active', d.dataset.tab === tab);
    });
  },

  openMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer-backdrop');
    if (drawer) drawer.classList.add('open');
  },

  closeMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
  },

  openMobileQRModal() {
    this.closeMobileDrawer();
    const modal = document.getElementById('mobile-qr-modal');
    if (modal) modal.classList.add('open');
  },

  closeMobileQRModal() {
    const modal = document.getElementById('mobile-qr-modal');
    if (modal) modal.classList.remove('open');
  },

  copyMobileUrl() {
    navigator.clipboard.writeText(this.localNetworkUrl).then(() => {
      if (window.OfflineSync) {
        window.OfflineSync.showToast('Copied URL to clipboard: ' + this.localNetworkUrl, 'success');
      }
    }).catch(() => {
      prompt('Copy mobile URL:', this.localNetworkUrl);
    });
  },

  // Generates a crisp SVG QR code matrix for http://192.168.0.176:8085
  generateMobileQRCode() {
    const container = document.getElementById('mobile-qr-code-display');
    if (!container) return;

    // Use a clean external QR API or SVG fallback
    const targetUrl = encodeURIComponent(this.localNetworkUrl);
    container.innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${targetUrl}&bgcolor=ffffff&color=0d9488&margin=4" 
           alt="Scan QR code to open SwasthyaSetu on Mobile"
           width="180" 
           height="180" 
           style="border-radius:8px; display:block; margin:0 auto;"
           onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'180\\' height=\\'180\\' viewBox=\\'0 0 180 180\\'%3E%3Crect width=\\'180\\' height=\\'180\\' fill=\\'%23ffffff\\'/ %3E%3Ctext x=\\'90\\' y=\\'95\\' fill=\\'%230d9488\\' font-size=\\'13\\' font-family=\\'sans-serif\\' text-anchor=\\'middle\\'%3E192.168.0.176:8085%3C/text%3E%3C/svg%3E';">
    `;
  }
};

window.MobileWeb = MobileWeb;
window.addEventListener('DOMContentLoaded', () => MobileWeb.init());
