import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Remplacer par le domaine perso une fois choisi/confirmé (ex: "https://nathalieblitte.fr")
// En attendant : URL provisoire GitHub Pages.
export default defineConfig({
  site: "https://nblitte.github.io",
  base: "/",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/neovim/") && !page.includes("/blog") })],
});
