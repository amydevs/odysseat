/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    output: "standalone",
    serverExternalPackages: [
        "@blocknote/server-util",
        // "@blocknote/react",
        // "@blocknote/core",
    ],
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.taste.com.au',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default config;
