/**
 * PHPOffline - PHP WebAssembly (WASM) Client Engine Bridge
 * 
 * Manages the client-side PHP WebAssembly runtime execution inside 
 * the browser when the network connection is disconnected.
 * 
 * @author Nasim Akhtab <https://github.com/NasimDev95>
 * @license MIT
 */

class PHPOfflineWasmBridge {
    constructor(options = {}) {
        this.engineInstance = null;
        this.isInitialized = false;
        this.phpVersion = options.phpVersion || '8.2';
        this.cdnWasmUrl = options.cdnWasmUrl || `https://cdn.jsdelivr.net/npm/@php-wasm/web@0.0.9/php-web.js`;
    }

    /**
     * Initialize the WebAssembly PHP Runtime Engine
     */
    async initEngine() {
        if (this.isInitialized) {
            console.log('PHPOffline WASM: Engine already initialized.');
            return this.engineInstance;
        }

        console.log('PHPOffline WASM: Initializing PHP WebAssembly Engine...');

        try {
            // Load the PHP WebAssembly script dynamically if not available globally
            if (typeof window.PhpWeb === 'undefined') {
                await this.loadScript(this.cdnWasmUrl);
            }

            if (typeof window.PhpWeb !== 'undefined') {
                this.engineInstance = await window.PhpWeb.load(this.phpVersion);
                this.isInitialized = true;
                console.log('PHPOffline WASM: Engine loaded successfully 🎉');
            } else {
                throw new Error('PhpWeb module not available after loading script.');
            }

            return this.engineInstance;
        } catch (error) {
            console.error('PHPOffline WASM Initialization Failed:', error);
            return null;
        }
    }

    /**
     * Execute a string of PHP code directly in the browser
     * 
     * @param {string} phpCode 
     * @returns {Promise<string>} Rendered output
     */
    async runCode(phpCode) {
        if (!this.isInitialized) {
            await this.initEngine();
        }

        if (!this.engineInstance) {
            throw new Error('PHP WASM Engine is not active.');
        }

        try {
            const response = await this.engineInstance.run({
                code: phpCode
            });

            return response.text;
        } catch (error) {
            console.error('PHPOffline WASM Execution Error:', error);
            return `<div style="color:red; padding:10px; border:1px solid red;">
                        <strong>PHPOffline WASM Runtime Error:</strong> ${error.message}
                    </div>`;
        }
    }

    /**
     * Helper to load external JS script
     * 
     * @param {string} src 
     * @returns {Promise<void>}
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    }
}

// Attach to window object for global usage
window.phpOfflineWasm = new PHPOfflineWasmBridge();
