import type { Language } from "../language";
import type { ContactInfo } from "../contact_info";

interface ResumeSkill {
    name: string;
    icon: ImageMetadata;
    proficiency: number;
}

interface ResumeEducation {
    institution: string;
    logo: ImageMetadata;
    degree: string;
    gpa: number;
    start_year: number;
    end_year?: number;
    accolades: string[];
}

interface ResumeWork {
    company: string;
    logo: ImageMetadata;
    position: string;
    start_year: number;
    end_year?: number;
    accolades: string[];
}

interface Resume {
    name: string;
    profile_picture: ImageMetadata;
    contact_info: ContactInfo[];
    skills: ResumeSkill[];
    education: ResumeEducation[];
    work: ResumeWork[];
}

type ResumeGetter = (language: Language) => Resume;

import getResumeSkylerRiggle from "./skylerriggle";

const resume_list: Map<string, ResumeGetter> = new Map<string, ResumeGetter>([
    ["skylerriggle", getResumeSkylerRiggle]
]);

function getResume(name: string, language: Language): Resume {
    const resume: ResumeGetter | undefined = resume_list.get(name);

    if (resume !== undefined) return resume(language);

    console.error(`Cannot find resume data with name: ${name}`);

    return {
        name: "Unknown",
        profile_picture: {} as ImageMetadata,
        contact_info: [],
        skills: [],
        education: [],
        work: []
    }
}

export type { Resume, ResumeSkill, ResumeEducation, ResumeWork, ResumeGetter };
export default getResume;