import { Language } from "../language";
import getContactInfo from "../contact_info";
import type { Resume, ResumeSkill, ResumeEducation, ResumeWork } from "./resume";

import profile_picture from "../../assets/images/SkylerRiggle.webp";

import threejs_logo from "../../assets/logos/ThreeJS.svg";
import c_logo from "../../assets/logos/C.svg";
import react_logo from "../../assets/logos/React.svg";
import astro_logo from "../../assets/logos/Astro.svg";
import typescript_logo from "../../assets/logos/Typescript.svg";
import sql_logo from "../../assets/logos/SQL.svg";
import game_dev_icon from "../../assets/icons/Joystick.svg";
import c_sharp_logo from "../../assets/logos/CSharp.svg";

import ou_logo from "../../assets/logos/OU.svg";
import gctc_logo from "../../assets/logos/GordonCooper.webp";
import k20_logo from "../../assets/logos/K20.webp";

function getResumeSkylerRiggle(language: Language): Resume {
    // ? Skills

    const threejs_skill: ResumeSkill = {
        name: "ThreeJS",
        icon: threejs_logo,
        proficiency: 95
    }

    const c_skill: ResumeSkill = {
        name: "C",
        icon: c_logo,
        proficiency: 80
    }

    const react_skill: ResumeSkill = {
        name: "React",
        icon: react_logo,
        proficiency: 95
    }

    const astro_skill: ResumeSkill = {
        name: "Astro",
        icon: astro_logo,
        proficiency: 100
    }

    const typescript_skill: ResumeSkill = {
        name: "Typescript",
        icon: typescript_logo,
        proficiency: 100
    }

    const sql_skill: ResumeSkill = {
        name: "SQL",
        icon: sql_logo,
        proficiency: 95
    }

    const game_dev_skill: ResumeSkill = {
        name: "",
        icon: game_dev_icon,
        proficiency: 85
    }

    const c_sharp_skill: ResumeSkill = {
        name: "C#",
        icon: c_sharp_logo,
        proficiency: 90
    }

    // ? Education

    const masters_ed: ResumeEducation = {
        institution: "",
        logo: ou_logo,
        degree: "",
        gpa: 4.0,
        start_year: 2024,
        end_year: 2025,
        accolades: []
    }

    const undergrad_ed: ResumeEducation = {
        institution: "",
        logo: ou_logo,
        degree: "",
        gpa: 3.79,
        start_year: 2020,
        end_year: 2024,
        accolades: []
    }

    const gctc_ed: ResumeEducation = {
        institution: "",
        logo: gctc_logo,
        degree: "",
        gpa: 4.0,
        start_year: 2017,
        end_year: 2020,
        accolades: []
    }

    // ? Work

    const ta_work: ResumeWork = {
        company: "",
        logo: ou_logo,
        position: "",
        start_year: 2023,
        end_year: 2025,
        accolades: []
    }

    const k20_work: ResumeWork = {
        company: "",
        logo: k20_logo,
        position: "",
        start_year: 2022,
        end_year: 2024,
        accolades: []
    }

    switch (language) {
        case Language.ENGLISH:
            game_dev_skill.name = "Game Dev.";

            masters_ed.institution = "The University of Oklahoma";
            masters_ed.degree = "M.S. Computer Science";
            masters_ed.accolades.push(
                "Implemented a basic GPU design on an FPGA as my non-thesis Master's project, exploring the potential performance gains for this alternative method of computation."
            );

            undergrad_ed.institution = "The University of Oklahoma";
            undergrad_ed.degree = "B.S. Computer Science / Math Minor";
            undergrad_ed.accolades.push(
                "GDA (Game Developers Association) President, Vice President, and Engineering Director.",
                "Performed club administrative, finance, technology, and educational activities for GDA.",
                "Hacklahoma Technology Coordinator and Finance Officer.",
                "Gathered corporate sponsorships, developed registration site, and created Discord moderation bot for Hacklahoma.",
                "Big Event and E-Week volunteer.",
                "Hacklahoma Best Hardware Hack and Best Beginner Hack awards."
            );

            gctc_ed.institution = "Gordon Cooper Technology Center";
            gctc_ed.degree = "Pre-Engineering Certificate";
            gctc_ed.accolades.push(
                "Graduate of Distinction.",
                "SkillsUSA Quiz Bowl district champions for 2018.",
                "ACT WorkKeys Platinum Certification.",
                "Food bank, clothing drive, and educational events volunteer."
            );

            ta_work.company = "The University of Oklahoma";
            ta_work.position = "Teaching Assistant";
            ta_work.accolades.push(
                "Assisted in courses Introduction to Operating Systems (Undergraduate Course) and Computer Graphics (Graduate Course).",
                "Hosted office hours and tutoring sessions multiple times per week for students.",
                "Taught class sessions for Introduction to Operating Systems and a C Introduction workshop.",
                "Performed course administrative tasks and graded student assignments."
            );

            k20_work.company = "K20 Center";
            k20_work.position = "Programmer";
            k20_work.accolades.push(
                "Created the Game-Based Learning team's game portal website, both the frontend and backend.",
                "Performed QA testing and documentation for websites, games, and internal tools.",
                "Refactored and optimized websites, games, and tool softwares.",
                "Programmed the statistics dashboard and calculations for game portal performance information."
            );

            break;
    }

    return {
        name: "Skyler Riggle",
        profile_picture: profile_picture,
        contact_info: getContactInfo(language),
        skills: [
            threejs_skill, c_skill, react_skill, astro_skill,
            typescript_skill, sql_skill, game_dev_skill, c_sharp_skill
        ].sort((a: ResumeSkill, b: ResumeSkill) => b.proficiency - a.proficiency),
        education: [masters_ed, undergrad_ed, gctc_ed],
        work: [ta_work, k20_work]
    };
}

export default getResumeSkylerRiggle;