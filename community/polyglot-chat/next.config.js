/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Environment variables
    env: {
        NEXT_PUBLIC_APP_NAME: "PolyglotChat",
    },

    // Headers for security and CORS
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, Content-Type, Authorization",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
