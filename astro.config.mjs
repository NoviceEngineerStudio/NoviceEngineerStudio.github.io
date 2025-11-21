// @ts-check
import { defineConfig } from 'astro/config';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    site: "https://noviceengineerstudio.github.io",
    base: "/client",
    trailingSlash: "always",
    adapter: node({
        mode: "standalone"
    })
});