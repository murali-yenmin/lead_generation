// next.config.ts
import type { NextConfig } from "next";
import path from "path";
import webpack from "webpack";

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
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "placehold.co", // ✅ Add this line
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**.fbcdn.net",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "graph.facebook.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "www.facebook.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**.cdninstagram.com",
      pathname: "/**",
    },
    {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**", // allow all LinkedIn media paths
      },
  ],
},

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },

  webpack(config, { webpack }) {
    // ✅ Support for .wav files
    config.module?.rules?.push({
      test: /\.wav$/,
      use: ["file-loader"],
    });

    // ✅ Custom alias
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@": path.resolve(__dirname, "src"),
      };
    }

    // ✅ Add custom DefinePlugin variable
    config.plugins?.push(
      new webpack.DefinePlugin({
        __MY_CUSTOM_VAR__: JSON.stringify("custom_value"),
      })
    );

    return config;
  },
};

export default nextConfig;
