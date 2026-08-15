/**
 * PHPOffline - Offline Setup & Cache Installer
 * 
 * Handles Service Worker registration, triggers offline asset pre-caching,
 * and updates UI progress indicators for the user.
 * 
 * @author Nasim Akhtab <https://github.com/NasimDev95>
 * @license MIT
 */

class PHPOfflineInstaller {
    constructor(options = {}) {
        this.swPath = options.swPath || '/assets/sw.js';
        this.cacheName = options.cacheName || 'phpoffline-v1';
        this.assetsToCache = options.assetsToCache || [
            '/',
            '/index.php',
            '/assets/js/php-wasm.js',
            '/assets/js/offline-setup.js',
            '/assets/workbox/workbox-sw.js'
        ];
        
        this.btnElement = null;
        this.progressContainer = null;
        this.progressBar = null;
        this.statusText = null;
    }

    /**
     * Bind UI elements for setup trigger
     * 
     * @param {Object} selectors DOM Element Selectors
     */
    bindUI(selectors = {}) {
        this.btnElement = document.querySelector(selectors.btn || '#btn-setup-offline');
        this.progressContainer = document.querySelector(selectors.progressContainer || '#offline-progress-wrapper');
        this.progressBar = document.querySelector(selectors.progressBar || '#offline-progress-bar');
        this.statusText = document.querySelector(selectors.statusText || '#offline-status-text');

        if (this.btnElement) {
            this.btnElement.addEventListener('click', () => this.startInstallation());
        }
    }

    /**
     * Start the offline installation process
     */
    async startInstallation() {
        if (!('serviceWorker' in navigator)) {
            alert('Your browser does not support Service Workers. Offline mode unavailable.');
            return;
        }

        this.updateUIStatus(0, 'Initializing Service Worker...', true);

        try {
            // Register Service Worker
            const registration = await navigator.serviceWorker.register(this.swPath);
            console.log('PHPOffline SW Registered successfully:', registration.scope);

            this.updateUIStatus(20, 'Opening browser cache storage...');
            const cache = await caches.open(this.cacheName);

            // Fetch and store assets with progress tracking
            const totalAssets = this.assetsToCache.length;
            let downloaded = 0;

            for (const assetUrl of this.assetsToCache) {
                try {
                    await cache.add(assetUrl);
                    downloaded++;
                    const progress = Math.round(20 + (downloaded / totalAssets) * 70);
                    this.updateUIStatus(progress, `Caching asset (${downloaded}/${totalAssets}): ${assetUrl}`);
                } catch (err) {
                    console.warn(`Failed to cache asset: ${assetUrl}`, err);
                }
            }

            this.updateUIStatus(100, 'Offline setup complete! System is ready to run offline.', false);
            alert('PHPOffline setup successfully completed! You can now use this site without internet connection.');

            if (this.btnElement) {
                this.btnElement.innerText = 'Offline Mode Active';
                this.btnElement.disabled = true;
            }

        } catch (error) {
            console.error('PHPOffline Installation Error:', error);
            this.updateUIStatus(0, 'Failed to setup offline mode. Please try again.', false);
            alert('Failed to initialize offline setup. Check console logs for details.');
        }
    }

    /**
     * Update progress bar and text UI
     * 
     * @param {number} percentage 
     * @param {string} text 
     * @param {boolean} showProgress 
     */
    updateUIStatus(percentage, text, showProgress = true) {
        if (this.statusText) {
            this.statusText.innerText = text;
        }

        if (this.progressBar) {
            this.progressBar.value = percentage;
            this.progressBar.style.width = `${percentage}%`;
        }

        if (this.progressContainer && showProgress) {
            this.progressContainer.style.display = 'block';
        }
    }
}

// Auto-initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.phpOfflineInstaller = new PHPOfflineInstaller();
    window.phpOfflineInstaller.bindUI();
});
