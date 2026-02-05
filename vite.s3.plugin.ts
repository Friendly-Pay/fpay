import {
    DeleteObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import mimeTypes from 'mime-types';
import path from 'path';
import readDir from 'recursive-readdir';
import { ConfigEnv, Plugin, ResolvedConfig, UserConfig } from 'vite';

const PATH_SEP = path.sep;
const UPLOAD_IGNORES: string[] = ['.DS_Store', 'payment.html', 'create-payment.html'];

const translatePathFromFiles = (dir: string, files: string[]) =>
    files.map((file: string) => ({
        path: file,
        name: file.replace(dir, '').split(PATH_SEP).join('/'),
    }));

const getDirectoryFilesRecursive = async (
    dir: string,
    ignores: ReadonlyArray<string> = []
): Promise<{ path: string; name: string }[]> =>
    new Promise((resolve, reject) => {
        readDir(dir, ignores, (err, files) => {
            if (err) reject(err);
            else resolve(translatePathFromFiles(dir, files));
        });
    });

const deleteAllByPrefix = async (s3: S3Client, bucket: string, prefix: string) => {
    let continuationToken: string | undefined;
    let isTruncated = true;

    // eslint-disable-next-line no-console
    console.log('\x1b[90m%s\x1b[0m', `clearing prefix: s3://${bucket}/${prefix}`);

    while (isTruncated) {
        const listResp = await s3.send(
            new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: prefix,
                ContinuationToken: continuationToken || undefined,
            }),
        );

        const keys = (listResp.Contents ?? [])
            .map((o) => o.Key)
            .filter((k): k is string => Boolean(k));

        for (const Key of keys) {
            await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key }));
        }

        isTruncated = Boolean(listResp.IsTruncated);
        continuationToken = listResp.NextContinuationToken;
    }
};

export default function s3BucketUploadAssets(): Plugin {
    let viteConfig: ResolvedConfig;

    const options = {
        enabled: false,
        bucket: process.env.VITE_S3_BUCKET!,
        region: process.env.VITE_S3_REGION!,
        endpoint: process.env.VITE_S3_ENDPOINT!,
        accessKey: process.env.VITE_S3_ACCESS_KEY!,
        secretKey: process.env.VITE_S3_SECRET_KEY!,
    };

    return {
        name: 'vite-plugin-s3',
        enforce: 'post',
        apply(_: UserConfig, { command }: ConfigEnv) {
            return command === 'build';
        },
        configResolved(config) {
            viteConfig = config;
            options.enabled =
                config.mode === 'production' &&
                process.env.VITE_S3_UPLOAD === 'true';
        },
        closeBundle: {
            async handler() {
                if (viteConfig.build.ssr || !options.enabled) {
                    return;
                }

                const appVersion = process.env.VITE_APP_VERSION!;
                const subDir = process.env.VITE_S3_SUBDIRECTORY?.replace(/^\/|\/$/g, '') || '';
                const prefixRoot = subDir ? `${subDir}/` : '';

                if (prefixRoot !== 'pay/') {
                    throw new Error(`[vite-plugin-s3] Expected prefixRoot "pay/", got "${prefixRoot}".`);
                }

                const buildPrefix = `${prefixRoot}${appVersion}/`;

                const s3 = new S3Client({
                    credentials: {
                        accessKeyId: options.accessKey,
                        secretAccessKey: options.secretKey,
                    },
                    region: options.region,
                    endpoint: options.endpoint,
                    forcePathStyle: true,
                });

                await deleteAllByPrefix(s3, options.bucket, `${buildPrefix}assets/`);

                const outDir = viteConfig.build.outDir; // dist/<version>
                const files = await getDirectoryFilesRecursive(outDir, UPLOAD_IGNORES);

                for (const file of files) {
                    const body = fs.readFileSync(file.path);
                    const contentType = mimeTypes.lookup(file.name) || 'application/octet-stream';
                    const disposition = `inline; filename="${path.basename(file.name)}"`;

                    const normalizedName = file.name.replace(/^\/+/, ''); // убираем ведущий /
                    const key = `${buildPrefix}${normalizedName}`;

                    await s3.send(new PutObjectCommand({
                        Bucket: options.bucket,
                        Key: key,
                        Body: body,
                        ContentType: contentType,
                        ContentDisposition: disposition,
                        CacheControl: 'public, max-age=31536000, immutable',
                    }));

                    // eslint-disable-next-line no-console
                    console.log('\x1b[90m%s\x1b[0m', `${key} uploaded`);
                }

                // eslint-disable-next-line no-console
                console.log(
                    '\x1b[32m%s\x1b[0m',
                    `✓ dist uploaded to ${buildPrefix} of bucket "${options.bucket}"`
                );
            },
        },
    };
}