export interface ContactInfo {
    label: string;
    info: string;
    href?: string;
    mat_icon: string;
}

const contact_info: ContactInfo[] = [
    {
        label: "Email",
        info: "skyler32702@gmail.com",
        href: "mailto:skyler32702@gmail.com",
        mat_icon: "email",
    }, {
        label: "Phone",
        info: "(405) 287-7394",
        href: "tel:4052877394",
        mat_icon: "phone",
    }, {
        label: "Fiverr",
        info: "Profile Page",
        href: "https://www.fiverr.com/s/0bB6zEx",
        mat_icon: "account_circle",
    }, {
        label: "Upwork",
        info: "Profile Page",
        href: "https://www.upwork.com/freelancers/~010bdcb621d6b4adc5?mp_source=share",
        mat_icon: "account_circle",
    }, {
        label: "GitHub",
        info: "Profile Page",
        href: "https://github.com/NoviceEngineerStudio",
        mat_icon: "source",
    },
];

export default contact_info;