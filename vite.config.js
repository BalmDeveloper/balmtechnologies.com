import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        insights: './insights.html',
        article: './insights/the-gift-of-naming-things.html',
        portfolio: './portfolio.html'
      }
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});
