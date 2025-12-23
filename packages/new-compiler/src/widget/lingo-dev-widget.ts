/**
 * Framework-agnostic dev widget using Web Components
 * Displays translation status in development mode
 *
 * IMPORTANT: This module must be dynamically imported client-side only!
 * It extends HTMLElement which doesn't exist in Node.js (SSR).
 * See TranslationContext.tsx for proper usage with useEffect + dynamic import.
 */

import type { LingoDevState, WidgetPosition } from "./types";
import { logger } from "../utils/logger";

/**
 * Lingo.dev Dev Widget Custom Element
 *
 * This Web Component displays translation status and updates based on
 * window.__LINGO_DEV_STATE__ changes triggered by LingoProvider.
 */
class LingoDevWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private state: LingoDevState | null = null;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Subscribe to state updates
    window.__LINGO_DEV_UPDATE__ = () => {
      this.state = window.__LINGO_DEV_STATE__ || null;
      this.render();
    };

    // Initial render with existing state
    if (window.__LINGO_DEV_STATE__) {
      this.state = window.__LINGO_DEV_STATE__;
      this.render();
    }

    this.connectWebSocket();
  }

  disconnectedCallback() {
    if (window.__LINGO_DEV_UPDATE__) {
      delete window.__LINGO_DEV_UPDATE__;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private connectWebSocket() {
    const wsUrl = window.__LINGO_DEV_WS_URL__;
    if (!wsUrl) {
      logger.warn("WebSocket URL not available, real-time updates disabled");
      return;
    }

    try {
      const url = new URL(wsUrl);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

      this.ws = new WebSocket(url.toString());

      this.ws.onopen = () => {
        logger.info("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerEvent(data);
        } catch (error) {
          logger.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        logger.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        logger.info("WebSocket disconnected");
        this.ws = null;

        // Attempt to reconnect with exponential backoff
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(
            1000 * Math.pow(2, this.reconnectAttempts),
            10000,
          );
          this.reconnectAttempts++;
          logger.info(
            `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
          );
          setTimeout(() => this.connectWebSocket(), delay);
        }
      };
    } catch (error) {
      logger.error("Failed to create WebSocket connection:", error);
    }
  }

  private handleServerEvent(event: any) {
    switch (event.type) {
      case "connected":
        logger.info(`Connected to translation server: ${event.serverUrl}`);
        break;

      case "batch:start":
        // Update state to show server translation is in progress
        if (this.state) {
          this.state.serverProgress = {
            locale: event.locale,
            total: event.total,
            completed: 0,
            status: "in-progress",
          };
          this.render();
        }
        break;

      case "batch:progress":
        // Update progress
        if (this.state && this.state.serverProgress) {
          this.state.serverProgress.completed = event.completed;
          this.render();
        }
        break;

      case "batch:complete":
        // Clear server progress after a delay
        if (this.state && this.state.serverProgress) {
          this.state.serverProgress.status = "complete";
          this.render();

          setTimeout(() => {
            if (this.state) {
              this.state.serverProgress = undefined;
              this.render();
            }
          }, 2000);
        }
        break;

      case "batch:error":
        if (this.state && this.state.serverProgress) {
          this.state.serverProgress.status = "error";
          this.render();
        }
        break;
    }
  }

  private render() {
    // Hide widget when on source locale
    if (!this.state) {
      this.shadow.innerHTML = "";
      return;
    }

    const { isLoading, locale, pendingCount, position, serverProgress } =
      this.state;

    // Show loader if either client or server translations are in progress
    const showLoader = isLoading || serverProgress?.status === "in-progress";

    this.shadow.innerHTML = `
      <style>
        ${this.getStyles(position)}
      </style>
      <div class="container">
        ${showLoader ? this.renderLoader() : this.renderLogo()}
        <svg height="26" viewBox="0 0 650 171" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M391.372 137.084H373.458V119.326H391.372V137.084Z" fill="white"/>
<path d="M420.766 133.46C415.204 130 410.808 125.121 407.566 118.842C404.329 112.562 402.685 105.422 402.685 97.4631C402.685 89.5033 404.306 82.4043 407.566 76.1645C410.808 69.925 415.227 65.0853 420.766 61.6257C426.327 58.1659 432.506 56.446 439.326 56.446C449.283 56.446 457.245 60.2258 463.222 67.7652H464.001V27.0283H479.56V137.08H466.204L464.624 127.02H463.845C457.764 134.78 449.583 138.66 439.326 138.66C432.506 138.66 426.327 136.94 420.766 133.48V133.46ZM452.606 120.881C456.102 118.681 458.883 115.542 460.943 111.442C462.985 107.362 464.001 102.683 464.001 97.4429C464.001 92.2033 462.985 87.5637 460.943 83.5241C458.906 79.4843 456.126 76.3645 452.606 74.1647C449.087 71.9649 445.285 70.865 441.206 70.865C437.127 70.865 433.187 71.9649 429.726 74.1647C426.264 76.3645 423.506 79.4843 421.464 83.5241C419.427 87.5637 418.406 92.2033 418.406 97.4429C418.406 102.683 419.427 107.482 421.464 111.522C423.506 115.562 426.264 118.681 429.726 120.881C433.187 123.081 437.006 124.181 441.206 124.181C445.406 124.181 449.087 123.081 452.606 120.881Z" fill="white"/>
<path d="M516.206 119.059C521.006 122.619 525.904 125.118 532.083 125.118C536.485 125.118 540.362 124.118 543.725 122.139C547.083 120.139 549.581 117.579 551.266 114.44H567.46C565.043 121.459 560.802 127.258 554.722 131.818C548.641 136.378 541.106 138.658 532.083 138.658C524.745 138.658 518.087 136.897 512.127 133.398C506.145 129.898 501.466 125.018 498.045 118.779C494.647 112.54 492.945 105.44 492.945 97.481C492.945 89.5212 494.647 82.5819 498.045 76.3423C501.448 70.1028 506.145 65.2432 512.127 61.7234C518.104 58.2237 524.745 56.4638 532.083 56.4638C539.422 56.4638 545.462 58.1437 551.185 61.5034C556.902 64.8632 561.402 69.4628 564.702 75.3424C568.002 81.2221 569.664 87.8216 569.664 95.141C569.664 98.8004 569.404 101.581 568.879 103.48H508.447L521.404 91.541H554.283C553.764 85.2618 551.445 80.062 547.366 75.9824C543.281 71.9026 538.181 69.8428 532.124 69.8428C526.066 69.8428 520.545 71.8826 516.247 75.9824C511.948 80.062 509.387 85.2618 508.545 91.541C508.545 91.541 505.227 110.98 516.247 119.119L516.206 119.059Z" fill="white"/>
<path d="M621.998 137.084H599.197L571.378 58.0104H587.74L609.115 119.486H612.259L633.634 58.0104H649.996L622.015 137.084H621.998Z" fill="white"/>
<path d="M96.158 43.0674H79.18V27.3486H96.158V43.0674ZM95.378 137.08H79.82V58.0063H95.378V137.08Z" fill="white"/>
<path d="M112.508 137.082V58.0083H125.867L127.447 66.1877H128.227C130.207 63.6678 133.247 61.428 137.346 59.4281C141.426 57.4283 146.146 56.4484 151.505 56.4484C157.585 56.4484 163.004 57.8483 167.784 60.6081C172.544 63.3879 176.284 67.2876 178.943 72.3272C181.623 77.3668 182.943 83.1266 182.943 89.6257V137.102H167.384V90.8857C167.384 85.2261 165.544 80.5066 161.885 76.7269C158.225 72.9471 153.665 71.0673 148.205 71.0673C144.546 71.0673 141.166 71.9672 138.066 73.7471C134.967 75.5269 132.546 77.9468 130.747 80.9868C128.967 84.0261 128.067 87.3261 128.067 90.8857V137.102H112.508V137.082Z" fill="white"/>
<path d="M214.923 165.84C209.523 163.02 205.403 159.481 202.583 155.221C199.763 150.962 198.244 146.662 198.024 142.243H213.742C214.162 145.902 216.162 149.142 219.722 151.901C223.282 154.682 228.221 156.061 234.501 156.061C240.78 156.061 246.18 154.221 250.06 150.562C253.939 146.882 255.88 142.022 255.88 135.943V123.364H255.1C252.379 126.404 248.96 128.823 244.88 130.603C240.801 132.383 236.281 133.283 231.361 133.283C224.542 133.283 218.402 131.663 212.883 128.403C207.383 125.163 203.063 120.604 199.924 114.725C196.784 108.865 195.204 102.205 195.204 94.766C195.204 87.3266 196.784 80.6873 199.924 74.8875C203.063 69.0679 207.383 64.5482 212.883 61.2885C218.382 58.0487 224.542 56.4088 231.361 56.4088C236.401 56.4088 241.02 57.4088 245.28 59.3887C249.52 61.3885 252.96 64.0483 255.58 67.4081H256.36L257.939 57.9687H271.458V136.103C271.458 142.802 269.998 148.722 267.059 153.861C264.119 159.001 259.859 162.981 254.239 165.801C248.64 168.64 242.06 170.04 234.501 170.04C226.942 170.04 220.322 168.62 214.923 165.801V165.84ZM244.78 116.084C248.18 114.044 250.88 111.165 252.88 107.445C254.879 103.726 255.859 99.5054 255.859 94.7862C255.859 90.0664 254.86 85.8866 252.88 82.2069C250.88 78.5472 248.18 75.6874 244.78 73.6476C241.38 71.6077 237.581 70.5878 233.381 70.5878C226.882 70.5878 221.522 72.8476 217.262 77.3473C213.023 81.8469 210.903 87.6664 210.903 94.8058C210.903 101.945 213.023 107.905 217.262 112.405C221.502 116.904 226.882 119.164 233.381 119.164C237.581 119.164 241.38 118.144 244.78 116.105V116.084Z" fill="white"/>
<path d="M303.031 133.382C297.051 129.883 292.372 125.003 288.952 118.764C285.552 112.524 283.852 105.425 283.852 97.4655C283.852 89.5057 285.552 82.5664 288.952 76.3269C292.351 70.0874 297.051 65.2277 303.031 61.708C309.011 58.2082 315.65 56.4484 322.989 56.4484C330.329 56.4484 336.948 58.2082 342.868 61.708C348.787 65.2277 353.447 70.0874 356.867 76.3269C360.267 82.5664 361.966 89.6061 361.966 97.4655C361.966 105.325 360.267 112.524 356.867 118.764C353.467 125.003 348.787 129.883 342.868 133.382C336.948 136.902 330.309 138.642 322.989 138.642C315.67 138.642 308.99 136.882 303.031 133.382ZM334.848 120.883C338.468 118.684 341.328 115.544 343.408 111.444C345.507 107.364 346.548 102.685 346.548 97.4453C346.548 92.2057 345.507 87.5661 343.408 83.5264C341.308 79.4867 338.448 76.3669 334.848 74.1671C331.228 71.9672 327.269 70.8673 322.989 70.8673C318.71 70.8673 314.73 71.9672 311.13 74.1671C307.511 76.3669 304.651 79.4867 302.571 83.5264C300.471 87.5661 299.431 92.2057 299.431 97.4453C299.431 102.685 300.471 107.345 302.571 111.444C304.67 115.524 307.53 118.684 311.13 120.883C314.75 123.083 318.71 124.183 322.989 124.183C327.269 124.183 331.249 123.083 334.848 120.883Z" fill="white"/>
<path d="M69.795 135.861H0V25.81H16.498V120.143L16.798 135.861L34.097 120.143H69.795V135.861Z" fill="white"/>
</svg>
      </div>
    `;
  }

  private getStyles(position: WidgetPosition): string {
    const positions = {
      "bottom-left": "bottom: 60px; left: 16px;",
      "bottom-right": "bottom: 60px; right: 16px;",
      "top-left": "top: 16px; left: 16px;",
      "top-right": "top: 16px; right: 16px;",
    };

    return `
      :host {
        position: fixed;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
        font-size: 12px;
        pointer-events: auto;
        ${positions[position]}
      }

      .container {
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease-in-out;
        border-radius: 8px;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.8);
        box-shadow: 0 0 0 1px #373737, inset 0 0 0 1px rgba(0, 0, 0, 0.24), 0px 16px 32px -8px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(48px);
      }

      .logo {
        width: 26px;
        height: 26px;
        flex-shrink: 0;
      }
    `;
  }

  private renderLogo(): string {
    return `
<svg height="26" viewBox="0 0 147 171" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.304987 76.63L54.9149 136.206C55.1326 136.441 55.4362 136.579 55.757 136.579H145.288C146.308 136.579 146.817 135.347 146.096 134.625L106.804 95.3334H75.87V110.801L39.7802 74.711H1.14708C0.150317 74.711 -0.370977 75.8968 0.304987 76.63Z" fill="#69E300"/>
<path d="M146.304 93.4186L91.6883 33.8424C91.4702 33.6075 91.1668 33.47 90.846 33.47H1.31509C0.289683 33.47 -0.220155 34.7017 0.501637 35.4235L39.7935 74.7153H70.7275V59.2483L106.817 95.3381H145.456C146.453 95.3381 146.974 94.1519 146.298 93.4186H146.304Z" fill="#69E300"/>
</g>
</svg>
    `;
  }

  private renderLoader(): string {
    return `
<svg height="26" viewBox="0 0 147 171" fill="none" xmlns="http://www.w3.org/2000/svg">
<style>
  @keyframes moveDown {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(12px); }
  }
  @keyframes moveUp {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  .bottom-part { animation: moveDown 1.5s ease-in-out infinite; transform-origin: center; }
  .top-part { animation: moveUp 1.5s ease-in-out infinite; transform-origin: center; }
</style>
<path class="bottom-part" d="M0.304987 76.63L54.9149 136.206C55.1326 136.441 55.4362 136.579 55.757 136.579H145.288C146.308 136.579 146.817 135.347 146.096 134.625L106.804 95.3334H75.87V110.801L39.7802 74.711H1.14708C0.150317 74.711 -0.370977 75.8968 0.304987 76.63Z" fill="grey"/>
<path class="top-part" d="M146.304 93.4186L91.6883 33.8424C91.4702 33.6075 91.1668 33.47 90.846 33.47H1.31509C0.289683 33.47 -0.220155 34.7017 0.501637 35.4235L39.7935 74.7153H70.7275V59.2483L106.817 95.3381H145.456C146.453 95.3381 146.974 94.1519 146.298 93.4186H146.304Z" fill="grey"/>
</g>
</svg>
    `;
  }
}

logger.debug("Loading Lingo Dev Widget...");
if (typeof window !== "undefined") {
  customElements.define("lingo-dev-widget", LingoDevWidget);
  const widget = document.createElement("lingo-dev-widget");
  document.body.appendChild(widget);

  // Initialize state if not already set (will be updated by LingoProvider)
  if (!window.__LINGO_DEV_STATE__) {
    window.__LINGO_DEV_STATE__ = {
      isLoading: false,
      locale: "en",
      sourceLocale: "en",
      pendingCount: 0,
      position: "bottom-left",
    };
  }

  // Trigger initial render
  if (window.__LINGO_DEV_UPDATE__) {
    window.__LINGO_DEV_UPDATE__();
  }
}

export { LingoDevWidget };
