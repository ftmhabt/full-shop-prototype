/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
    generateRobotsTxt: true,
    changefreq: "weekly",
    priority: 0.7,
    sitemapSize: 7000,
    exclude: ["/admin/*", "/auth/*"],
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: ["/admin", "/auth"] },
        ],
    },
    transform: async (config, path) => {
        // Optional: lower priority for less important pages
        let priority = 0.7;
        if (path.includes("/blog")) priority = 0.6;
        if (path.includes("/admin") || path.includes("/auth")) priority = 0.1;

        return {
            loc: path,
            changefreq: config.changefreq,
            priority,
            lastmod: new Date().toISOString(),
        };
    },
};
// Submit the sitemap URL to Google Search Console and Bing Webmaster Tools