module.exports = {
    exportTrailingSlash: false,
    exportPathMap: async function(defaultPathMap,
        { dev, dir, outDir, distDir, buildId }) {
        return {
            '/': { page: '/' },
            '/user': { page: '/user' },
            '/twit': { page: '/twit' }
        }
    },
    webpack: function (config) { 
        config.module.rules.push({
            test: /\.(png|jp(e*)g|svg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'images/[name].[ext]',
                },
              },
            ],
        });
    
        return config;
    },
}