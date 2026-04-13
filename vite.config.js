import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";

// Custom plugin to copy Images folder after build
const copyImagesPlugin = () => ({
  name: "copy-images",
  closeBundle() {
    const srcDir = resolve(__dirname, "Images");
    const destDir = resolve(__dirname, "dist", "Images");
    
    if (fs.existsSync(srcDir)) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      const files = fs.readdirSync(srcDir);
      for (const file of files) {
        const srcFile = resolve(srcDir, file);
        const destFile = resolve(destDir, file);
        fs.copyFileSync(srcFile, destFile);
      }
      console.log("✓ Images copied to dist/Images");
    }
  }
});

// Dev server rewrite plugin for clean URLs
const devServerRewritePlugin = () => ({
  name: "dev-server-rewrite",
  configureServer(server) {
    server.middlewares.use((req, url, next) => {
      const path = req.url || url;
      
      // Rewrite rules for clean URLs
      const rewrites = [
        { from: /^\/insights\/?$/, to: "/insights.html" },
        { from: /^\/portfolio\/?$/, to: "/portfolio.html" },
        { from: /^\/the-gift-of-naming-things\/?$/, to: "/insights/the-gift-of-naming-things.html" },
        { from: /^\/insights\/the-gift-of-naming-things\/?$/, to: "/insights/the-gift-of-naming-things.html" },
        { from: /^\/deals-are-forged-not-found\/?$/, to: "/insights/deals-are-forged-not-found.html" },
        { from: /^\/insights\/deals-are-forged-not-found\/?$/, to: "/insights/deals-are-forged-not-found.html" }
      ];
      
      for (const rewrite of rewrites) {
        if (rewrite.from.test(path)) {
          req.url = rewrite.to;
          break;
        }
      }
      
      next();
    });
  }
});

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        insights: resolve(__dirname, "insights.html"),
        article: resolve(__dirname, "insights/the-gift-of-naming-things.html"),
        article2: resolve(__dirname, "insights/deals-are-forged-not-found.html"),
        portfolio: resolve(__dirname, "portfolio.html")
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/styles-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js"
      }
    },
    outDir: "dist",
    emptyOutDir: true
  },
  server: {
    fs: {
      allow: [".."]
    }
  },
  plugins: [copyImagesPlugin(), devServerRewritePlugin()]
});
