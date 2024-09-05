import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://rashadkokash.com/",
  author: "Rashad Kokash",
  profile: "https://rashadkokash.com/",
  desc: "I talk about zeb development. Nodejs, React & Golang",
  title: "رشاد كوكش",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000,
};

export const LOCALE = {
  lang: "ar", // html lang code. Set this empty and default will be "en"
  langTag: ["ar-SA"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/rashadksh",
    linkTitle: ` ${SITE.title} على Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/rashad-kokash",
    linkTitle: `${SITE.title} على LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:rashadksh@gmail.com",
    linkTitle: `إرسال بريد إلكتروني إلى ${SITE.title}`,
    active: true,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@rksh1997",
    linkTitle: `${SITE.title} على YouTube`,
    active: true,
  },
];
