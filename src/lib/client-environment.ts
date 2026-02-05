// src/utils/clientEnvironment.ts
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

export interface ClientFingerprint {
    language: string | null;
    referrerHost: string;
    os: string;
    deviceType: DeviceType;
    browser: string;
    userAgent: string;
    resolution: {
        width: number;
        height: number;
    };
    guid: string;                  // generated client guid
    javaEnabled: boolean;
    screenDpi: number;
    colorDepth: number;
}

const ATOM_BROWSER_REGEX = /(Atom\/)/;
const WEBVIEW_REGEX = /(WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android.*(wv|Version\/)|Linux; U; Android)/ig;
const YANDEX_BROWSER_REGEX = /(Ya(Search)?Browser|Ya(Search)?App)/;

/** Простой guid на клиенте. */
const generateGuid = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    // Fallback для старых окружений
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
        const random = (Math.random() * 16) | 0;
        const value = char === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
};

/** Безопасно достаём window, document, navigator. */
const getWindowSafe = (): Window | null =>
    typeof window !== 'undefined' ? window : null;

const getDocumentSafe = (): Document | null =>
    typeof document !== 'undefined' ? document : null;

const getNavigatorSafe = (): Navigator | null =>
    typeof navigator !== 'undefined' ? navigator : null;

export class ClientEnvironment {
    private windowRef: Window | null;
    private documentRef: Document | null;
    private navigatorRef: Navigator | null;
    private userAgent: string;

    public fingerprint: ClientFingerprint;

    constructor() {
        this.windowRef = getWindowSafe();
        this.documentRef = getDocumentSafe();
        this.navigatorRef = getNavigatorSafe();
        this.userAgent = this.navigatorRef?.userAgent || '';

        this.fingerprint = {
            language: this.navigatorRef?.language ?? null,
            referrerHost: this.getReferrerHost(),
            os: this.detectOsName(),
            deviceType: this.getDeviceType(),
            browser: this.getBrowserName(),
            userAgent: this.userAgent,
            resolution: {
                width: this.windowRef?.screen.width ?? 0,
                height: this.windowRef?.screen.height ?? 0,
            },
            guid: generateGuid(),
            javaEnabled: false,
            screenDpi: this.getScreenDpi(),
            colorDepth: this.windowRef?.screen.colorDepth ?? -1,
        };
    }

    /** Проверка, что мы внутри iframe. */
    isInIframe(): boolean {
        if (!this.windowRef) return false;

        try {
            return (
                this.windowRef.self !== this.windowRef.top ||
                this.windowRef.self.document !== this.windowRef.top?.document ||
                this.windowRef.self.location !== this.windowRef.top?.location
            );
        } catch {
            // Если поймали SecurityError при доступе к top — считаем, что точно в iframe
            return true;
        }
    }

    /** Мобильное/планшетное устройство. */
    isMobile(): boolean {
        const type = this.getDeviceType();
        return type === 'mobile' || type === 'tablet';
    }

    /** WebView (iOS/Android). */
    isWebview(): boolean {
        return WEBVIEW_REGEX.test(this.userAgent);
    }

    /** Имя браузера. */
    getBrowserName(): string {
        if (this.isYandexBrowser()) return 'Yandex Browser';
        if (this.isAtomBrowser()) return 'Atom';

        const ua = this.userAgent;

        if (/Edg\//i.test(ua)) return 'Edge';
        if (/OPR\//i.test(ua)) return 'Opera';
        if (/Chrome\//i.test(ua) && !/OPR\//i.test(ua)) return 'Chrome';
        if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Safari';
        if (/Firefox\//i.test(ua)) return 'Firefox';

        return 'unknown';
    }

    /** Движок браузера. */
    getBrowserEngine(): string {
        const ua = this.userAgent;

        if (/AppleWebKit/i.test(ua) && /Chrome/i.test(ua)) return 'Blink';
        if (/AppleWebKit/i.test(ua)) return 'WebKit';
        if (/Gecko\/\d/i.test(ua)) return 'Gecko';
        if (/Trident\/\d/i.test(ua) || /MSIE \d/i.test(ua)) return 'Trident';

        return 'unknown';
    }

    /** Android устройство. */
    isAndroid(): boolean {
        return /Android/i.test(this.userAgent);
    }

    /** Получение куки по имени. */
    getCookie(name: string): string {
        if (!this.documentRef || !this.navigatorRef?.cookieEnabled) {
            return '';
        }

        const cookieRegExp = new RegExp(
            `(?:^|; )${name.replaceAll(
                /([.$?*|{}()[\]\\/+^])/g,
                String.raw`\$1`,
            )}=([^;]*)`,
        );

        const match = cookieRegExp.exec(this.documentRef.cookie);
        return match ? decodeURIComponent(match[1]) : '';
    }

    /** Яндекс.Браузер. */
    isYandexBrowser(): boolean {
        return YANDEX_BROWSER_REGEX.test(this.userAgent);
    }

    /** Браузер Atom. */
    isAtomBrowser(): boolean {
        return ATOM_BROWSER_REGEX.test(this.userAgent);
    }

    /** Оценка DPI экрана (ожидается наличие #dpi с высотой 1in). */
    getScreenDpi(): number {
        if (!this.documentRef || !this.windowRef) return 0;

        const dpiElement = this.documentRef.querySelector<HTMLElement>('#dpi');
        if (!dpiElement || !this.windowRef.devicePixelRatio) return 0;

        return dpiElement.offsetHeight * this.windowRef.devicePixelRatio;
    }

    /** Тип устройства по userAgent. */
    getDeviceType(): DeviceType {
        const ua = this.userAgent;

        if (/Tablet|iPad/i.test(ua)) return 'tablet';
        if (/Mobi|Android/i.test(ua)) return 'mobile';
        if (/Mac OS X/i.test(ua) || /Windows NT/i.test(ua) || /Linux x86_64/i.test(ua)) {
            return 'desktop';
        }

        return 'desktop';
    }

    /** Имя ОС. */
    private detectOsName(): string {
        const ua = this.userAgent;

        if (/Android/i.test(ua)) return 'Android';
        if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
        if (/Mac OS X/i.test(ua)) return 'Mac OS';
        if (/Windows NT/i.test(ua)) return 'Windows';
        if (/Linux/i.test(ua)) return 'Linux';

        return 'unknown';
    }

    /** Хост из referrer (как в оригинале — без протокола и пути). */
    private getReferrerHost(): string {
        if (!this.documentRef?.referrer) return '';

        const ref = this.documentRef.referrer;

        try {
            const url = new URL(ref);
            return url.hostname;
        } catch {
            // Фолбэк на регулярку а-ля оригинал
            return ref.replace(
                /https?:\/\/(?:www\.)?([0-9]?\.)?(.[^\/:]+)?(.*)/i,
                '$2',
            );
        }
    }
}