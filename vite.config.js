import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
    plugins: [svelte()],
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, "src/popup/popup.html"),
            },
            output: {
                entryFileNames: (asset) => {
                    if (asset.name === "background") return "background/background.js";
                    if (asset.name === "content") return "content/content.js";
                    return "popup/[name].js";
                }
            }
        }
    }
});
