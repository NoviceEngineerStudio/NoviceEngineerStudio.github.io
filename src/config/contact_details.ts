import github_icon from "../assets/logos/git.svg";
import email_icon from "../assets/icons/email.svg";
import fiverr_icon from "../assets/logos/fiverr.svg";

interface ContactDetail {
    icon: ImageMetadata;
    label: string;
    href: string;
};

const contact_details: ContactDetail[] = [
    {
        icon: email_icon,
        label: "NoviceEngineerStudio@outlook.com",
        href: "mailto:NoviceEngineerStudio@outlook.com"
    }, {
        icon: github_icon,
        label: "GitHub",
        href: "https://github.com/NoviceEngineerStudio"
    }, {
        icon: fiverr_icon,
        label: "Fiverr",
        href: "https://www.fiverr.com/s/1q9L96z"
    }
];

export { type ContactDetail };
export default contact_details;