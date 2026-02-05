import inlineHtmlScript from './vite.inline-script.plugin';
import minifyPublicAssets from './vite.minify.plugin';
import s3BucketUploadAssets from './vite.s3.plugin';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    let base: string;
    if (mode === 'production') {
        const hasCdn = process.env.VITE_CDN_BASE_URL !== '/';
        base = hasCdn
            ? `${process.env.VITE_CDN_BASE_URL}/${process.env.VITE_APP_VERSION}/`
            : `/${process.env.VITE_APP_VERSION}/`;
    } else {
        base = '/';
    }

    return {
        base,
        define: {
            __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION),
            __CDN_BASE_URL__: JSON.stringify(process.env.VITE_CDN_BASE_URL),
        },
        plugins: [
            react(),
            tsconfigPaths(),
            minifyPublicAssets(),
            s3BucketUploadAssets(),
            inlineHtmlScript({
                htmlTargets: [
                    'preload/payment.html',
                    'preload/create-payment.html',
                ],
            }),
            createHtmlPlugin({ minify: true }),
        ],
        publicDir: false,
        build: {
            target: 'es2015',
            sourcemap: false,
            manifest: false,
            outDir: `dist/${process.env.VITE_APP_VERSION}`,
            rollupOptions: {
                input: {
                    app: resolve(__dirname, 'index.html'),
                    preloadPayment: resolve(__dirname, 'preload/payment.html'),
                    preloadCreatePayment: resolve(__dirname, 'preload/create-payment.html'),
                },
                output: {
                    entryFileNames: 'assets/main-[hash].js',
                    assetFileNames: (assetInfo) => {
                        const originalName = assetInfo.name ?? '';
                        if (originalName.endsWith('.css')) return 'assets/styles-[hash][extname]';
                        return 'assets/[name]-[hash][extname]';
                    },
                    manualChunks(id) {
                        if (
                            id.includes('node_modules/core-js/') ||
                            id.includes('node_modules/regenerator-runtime/') ||
                            id.includes('node_modules/whatwg-fetch/') ||
                            id.includes('node_modules/abortcontroller-polyfill/')
                        ) {
                            return 'polyfills';
                        }
                    },
                }
            },
        },
        css: {
            modules: {
                localsConvention: 'camelCaseOnly'
            },
            postcss: {
                plugins: [autoprefixer()],
            },
        },
    };
});