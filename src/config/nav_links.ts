import { DEFAULT_LANGUAGE, Language } from "./language";

interface NavLink {
    text: string;
    href: string;
}

function getNavLinks(language?: Language): NavLink[] {
    if (language === undefined) language = DEFAULT_LANGUAGE;

    const home_link: NavLink = {
        text: "",
        href: `/${language}/`
    }

    const resume_link: NavLink = {
        text: "",
        href: `/${language}/resume/skylerriggle`
    }

    switch (language) {
        case Language.ENGLISH:
            home_link.text = "Home";
            resume_link.text = "Résumé";
            break;
    }

    return [
        home_link,
        resume_link
    ];
}

export { type NavLink };
export default getNavLinks;