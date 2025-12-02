/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.lottie$/,
      type: "json", // Treat .lottie files as JSON modules
    });

    return config;
  },
};

export default nextConfig;
