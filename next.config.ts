import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Disable canvas for server-side rendering (needed for PDF.js)
    config.resolve.alias.canvas = false;
    
    // Handle PDF.js worker files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    
    return config;
  },
  
  // External packages for server components
  serverExternalPackages: ['pdfjs-dist'],
};

export default nextConfig;
