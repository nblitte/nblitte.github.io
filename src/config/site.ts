// Source unique de vérité pour les infos du site.
// Modifie ici : nom, titre, description, liens, email.
export const SITE = {
  name: "Nathalie Blitte",
  title: "Nathalie Blitte — Cybersécurité, Qualité & Automatisation",
  description:
    "Portfolio, CV et articles sur la cybersécurité (SOC/GRC), l'automatisation des tests et la qualité logicielle.",
  url: "https://nblitte.github.io", // à remplacer par le domaine perso une fois choisi
  locale: "fr_FR",
};

export const LINKS = {
  github: "https://github.com/nblitte",
  linkedin: "https://www.linkedin.com/in/nathalieblitte",
  cvPdf: "", // ex. "/cv-nathalie-blitte.pdf" une fois le PDF déposé dans public/ ; vide = boutons masqués
  email: "nathalie.blitte@gmail.com",
};

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/cv", label: "CV" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/skills", label: "Compétences" },
  // { href: "/blog", label: "Blog" }, // à réactiver dès le premier article publié
  { href: "/contact", label: "Contact" },
];
