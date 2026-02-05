import { type Plugin, transformWithEsbuild } from 'vite';

type Options = {
    htmlTargets: string[];
};

export default function inlineScript(options: Options): Plugin {
    const targetSet = new Set(
        options.htmlTargets.map(p => p.replace(/\\/g, '/').replace(/^\/+/, '')),
    );

    return {
        name: 'inline-preload-script',
        apply: 'build',
        enforce: 'post',

        async transformIndexHtml(html, ctx) {
            const normalizedPath = (ctx.path || '').replace(/\\/g, '/').replace(/^\/+/, '');
            if (!targetSet.has(normalizedPath)) return html;

            const scriptRegex =
                /<script\b([^>]*\bdata-preload-script\b[^>]*)>([\s\S]*?)<\/script>/i;

            const match = html.match(scriptRegex);
            if (!match) return html;

            const rawCode = match[2];

            const transformed = await transformWithEsbuild(rawCode, `${normalizedPath}#preload.ts`, {
                loader: 'ts',
                target: 'es2018',
                minify: true,
            });

            const js = `(function(){\n${transformed.code}\n})();`;
            const replaced = html.replace(
                scriptRegex,
                `<script>${js}</script>`,
            );

            return replaced;
        },
    };
}