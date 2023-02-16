/** @type {import('next').NextConfig} */

const { withAxiom } = require("next-axiom");

module.exports = withAxiom({
  reactStrictMode: true,
  experimental: { images: { allowFutureImage: true } },
});
