import autoprefixer from 'autoprefixer';
import { transform as esbuildTransform } from 'esbuild';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import type { Plugin } from 'vite';
// ...

const postcssProcessor = postcss([autoprefixer()]);

export default function minifyPublicAssets(): Plugin {
    return {
        name: 'minify-public-assets',
        apply: 'build',
        async generateBundle() {
            const publicDir = path.resolve(process.cwd(), 'public');
            const files = await fg('**/*', { cwd: publicDir });

            for (const relPath of files) {
                const absPath = path.join(publicDir, relPath);
                const raw = await fs.readFile(absPath);

                if (relPath.endsWith('.css')) {
                    const rawCss = raw.toString('utf8');

                    // 1) префиксы
                    const prefixed = await postcssProcessor.process(rawCss, { from: undefined });

                    // 2) минификация (после префиксов)
                    const minified = await esbuildTransform(prefixed.css, {
                        loader: 'css',
                        minify: true,
                    });

                    this.emitFile({ type: 'asset', fileName: relPath, source: minified.code });
                    continue;
                }

                // остальные файлы из public копируем как есть
                this.emitFile({ type: 'asset', fileName: relPath, source: raw });
            }
        },
    };
}