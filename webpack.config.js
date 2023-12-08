const path =require('path');
const HTMLWebpackPlugin=require('html-webpack-plugin');
const MiniCssExtractPlugin=require('mini-css-extract-plugin');

module.exports= {
    mode: 'production',
    entry: './src/app.js',
    output:{
       path: path.resolve(__dirname,'dist'),
       filename: 'bundle.js'
    },
    module :{
        rules:[
            { 
                test: /\.css$/, 
                use:[MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: [
                        ['@babel/preset-env', { targets: "defaults" }]
                    ]
                    }
                }
            }
        ],
    },
    plugins:[
        new HTMLWebpackPlugin({
            title :'Webpack Starter',
            filename:'index.html',
            template:'./src/index.html',
        }),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3000,
        open:true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    }






}