// King Cobra - PWA Install Prompt

var deferredPrompt = null;

// Service Worker register karo
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js')
      .then(function(registration) {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch(function(err) {
        console.log('❌ Service Worker registration failed:', err);
      });
  });
}

// Install prompt capture karo
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  console.log('📱 Install prompt ready');
  showInstallBanner();
});

// Install Banner dikhao
function showInstallBanner() {
  // Agar already dikh raha hai toh skip karo
  if (document.getElementById('pwa-install-banner')) return;
  
  var banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="position:fixed;bottom:80px;left:15px;right:15px;background:linear-gradient(135deg,#B026FF,#8A2BE2);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(176,38,255,0.5);z-index:9999999;animation:slideUpPWA 0.4s ease-out;">
      <div style="width:44px;height:44px;border-radius:12px;background:url('icon-192.png') center/cover;flex-shrink:0;border:2px solid #FFD700;"></div>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:800;color:#fff;">King Cobra Install</div>
        <div style="font-size:10px;color:#eee;margin-top:2px;">App ki tarah istemal karein</div>
      </div>
      <button id="pwa-install-btn" style="background:linear-gradient(135deg,#FFD700,#FFA500);border:none;padding:10px 16px;border-radius:10px;color:#000;font-weight:800;font-size:12px;cursor:pointer;letter-spacing:0.5px;">INSTALL</button>
      <button id="pwa-close-btn" style="background:rgba(0,0,0,0.3);border:none;width:30px;height:30px;border-radius:50%;color:#fff;font-size:14px;cursor:pointer;flex-shrink:0;">✕</button>
    </div>
    <style>
      @keyframes slideUpPWA {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  `;
  document.body.appendChild(banner);
  
  // Install button
  document.getElementById('pwa-install-btn').addEventListener('click', function() {
    if (!deferredPrompt) {
      alert('Install option available nahi hai. Browser menu se "Add to Home Screen" karein.');
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log('User choice:', choiceResult.outcome);
      deferredPrompt = null;
      banner.remove();
    });
  });
  
  // Close button
  document.getElementById('pwa-close-btn').addEventListener('click', function() {
    banner.remove();
  });
}

// Agar app already installed hai toh banner mat dikhao
window.addEventListener('appinstalled', function() {
  console.log('✅ App installed');
  var banner = document.getElementById('pwa-install-banner');
  if (banner) banner.remove();
  deferredPrompt = null;
});

// iOS ke liye manual instruction
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

if (isIOS && !isStandalone) {
  setTimeout(function() {
    if (document.getElementById('pwa-install-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div style="position:fixed;bottom:80px;left:15px;right:15px;background:linear-gradient(135deg,#B026FF,#8A2BE2);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(176,38,255,0.5);z-index:9999999;">
        <div style="width:44px;height:44px;border-radius:12px;background:url('icon-192.png') center/cover;flex-shrink:0;border:2px solid #FFD700;"></div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:800;color:#fff;">Install on iPhone</div>
          <div style="font-size:10px;color:#eee;margin-top:2px;">Share → Add to Home Screen</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background:rgba(0,0,0,0.3);border:none;width:30px;height:30px;border-radius:50%;color:#fff;font-size:14px;cursor:pointer;flex-shrink:0;">✕</button>
      </div>
    `;
    document.body.appendChild(banner);
  }, 3000);
}

console.log('📱 PWA System Loaded');