interface ResumeData {
    person: {
        name: string;
        headshot: ImageMetadata;
        position?: string;
        phone?: string;
        email?: string;
        address?: string;
    };
    skills: {
        name: string;
        icon_name: string;
        confidence: number;
    }[];
    education: {
        institution: string;
        start_year: number;
        end_year?: number;
        degree: string;
        gpa: number;
    }[];
    work_experience: {
        business: string;
        start_year: number;
        end_year?: number;
        position: string;
        duties: string[];
    }[];
    projects: {
        title: string;
        month?: string;
        year: number;
        descriptors: string[];
    }[];
    references: {
        name: string;
        relation: string;
        phone?: string;
        email?: string;
    }[];
};

export type { ResumeData };