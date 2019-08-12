const presets = [
  "@babel/preset-react",
  [
    "@babel/env",
    {
      targets: {
        edge: "12",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
    },
  ],
];

const plugins = ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"];

module.exports = { presets, plugins };