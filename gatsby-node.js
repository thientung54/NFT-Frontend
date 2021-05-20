const path = require('path');
const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: "empty",
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        process: 'process',
        stream: 'stream-browserify',
        zlib: 'browserify-zlib'
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        util: require.resolve('util/'),
        path: require.resolve("path-browserify"),
        electron: false
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process',
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.DefinePlugin({
        'process.env.BEP20_CONTRACT_ADDRESS': JSON.stringify("0xe8255E2765CbB734bA2edCa8578F55eA2AEA499A"),
        'process.env.NFT_CONTRACT_ADDRESS': JSON.stringify("0xC8f00D04b486D5E937BaBD1D1F330F2e2C1AF4D8"),
        'process.env.SIMPLE_EXCHANGE_ADDRESS': JSON.stringify("0xC6e6e3656BD8b37fEa95C1b48de013df89580c83"),
        'process.env.GAS_LIMIT': 500000,
        'process.env.SERVICE_FEE': 2.5,
      })
    ],
  });

  if (stage.startsWith('develop')) {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
          components: path.resolve(__dirname, 'src/components/'),
          assets: path.resolve(__dirname, 'src/assets/'),
          lib: path.resolve(__dirname, 'src/lib/'),
          store: path.resolve(__dirname, 'src/store/'),
        },
      },
    });
  }

  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /multiselect-react-dropdown/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
};
