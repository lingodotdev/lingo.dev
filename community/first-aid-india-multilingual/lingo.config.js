/** @type {import('@lingo.dev/js-sdk').LingoConfig} */
export default {
    source: 'en',
    catalogs: [
        {
            path: 'src/locales/{locale}.json',
            include: ['src/**/*.{js,jsx,ts,tsx}']
        }
    ],
    locales: ['en', 'hi', 'mr', 'ta'], // English, Hindi, Marathi, Tamil
}
