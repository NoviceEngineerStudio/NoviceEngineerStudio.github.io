import SUPPORTED_LANGUAGES, { DEFAULT_LANGUAGE, Language } from "./language";

import email_icon from "../assets/icons/Email.svg";
import fiverr_logo from "../assets/logos/Fiverr.svg";
import upwork_logo from "../assets/logos/UpWork.svg";
import github_logo from "../assets/logos/Git.svg";

interface ContactInfo {
    label: string;
    icon: ImageMetadata;
    text: string;
    href: string;
}

function getContactInfo(language: Language): ContactInfo[] {
    const email: ContactInfo = {
        label: "Email",
        icon: email_icon,
        text: "skyler32702@gmail.com",
        href: "mailto:skyler32702@gmail.com",
    }

    const fiverr: ContactInfo = {
        label: "Fiverr",
        icon: fiverr_logo,
        text: "",
        href: "https://www.fiverr.com/s/0bB6zEx",
    }

    const upwork: ContactInfo = {
        label: "Upwork",
        icon: upwork_logo,
        text: "",
        href: "https://www.upwork.com/freelancers/~010bdcb621d6b4adc5?mp_source=share",
    }

    const github: ContactInfo = {
        label: "GitHub",
        icon: github_logo,
        text: "",
        href: "https://github.com/NoviceEngineerStudio",
    }

    switch (language) {
        case Language.ENGLISH:
            fiverr.text = "Fiverr Account";
            upwork.text = "Upwork Account";
            github.text = "GitHub Account";
            break;
    }

    return [
        email,
        fiverr,
        upwork,
        github
    ];
}

export { type ContactInfo };
export default getContactInfo;