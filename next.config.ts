import type { NextConfig } from "next";
import type { Configuration, DefinePlugin } from "webpack";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },

  // ✅ Add Webpack override here
  webpack(config: Configuration, { dev, isServer, webpack }) {
    // Example 1: Add support for .wav files
    config.module?.rules?.push({
      test: /\.wav$/,
      use: ["file-loader"],
    });

    // Example 2: Add custom alias (like @/components)
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@": path.resolve(__dirname, "src"),
      };
    }

    // Example 3: Add custom DefinePlugin variable
    config.plugins?.push(
      new webpack.DefinePlugin({
        __MY_CUSTOM_VAR__: JSON.stringify("custom_value"),
      })
    );

    return config;
  },
};

export default nextConfig;
