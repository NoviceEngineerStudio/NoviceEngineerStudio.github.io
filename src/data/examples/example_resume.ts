import type { ResumeData } from "../types/ResumeData";

import example_headshot from "../../assets/images/examples/example_headshot.webp";

const example_resume: ResumeData = {
    person: {
        name: "Lorenzo Za' Marinelli",
        headshot: example_headshot,
        position: "Artisan Pizzaiolo / Small Business Owner",
        phone: "(123) 456-7890",
        email: "lorenzo-pizza@example.com",
        address: "123 Road Ave. Town, ST 12345",
    },
    skills: [
        {
            name: "Sauce Mixing",
            icon_name: "soup_kitchen",
            confidence: 0.80,
        }, {
            name: "Dough Twirling",
            icon_name: "cyclone",
            confidence: 0.75,
        }, {
            name: "Topping Dicing",
            icon_name: "local_dining",
            confidence: 0.95,
        }, {
            name: "Pie Decorating",
            icon_name: "local_pizza",
            confidence: 0.85,
        }, {
            name: "Chesse Grating",
            icon_name: "dinner_dining",
            confidence: 0.70,
        }, {
            name: "Customer Service",
            icon_name: "sentiment_very_satisfied",
            confidence: 1.00,
        },
    ],
    education: [
        {
            institution: "Parm Institute of Culinary Arts",
            start_year: 1999,
            end_year: 2004,
            degree: "Bachelors of Arts in Pizza",
            gpa: 3.56,
        }, {
            institution: "Saint Roni's High School",
            start_year: 1995,
            end_year: 1999,
            degree: "High School Diploma",
            gpa: 3.84,
        },
    ],
    work_experience: [
        {
            business: "Lorenzo's Digital Pizzeria",
            start_year: 2014,
            end_year: undefined,
            position: "Owner and Operator",
            duties: [
                "Manage a staff of three pizzaiolos.",
                "Ship pizza to clients across the globe.",
                "Maintain a consistent stock of fresh ingredients.",
            ],
        }, {
            business: "Tiny Tony's Italian Eatery",
            start_year: 2005,
            end_year: 2012,
            position: "Assistant Pizzaiolo",
            duties: [
                "Kept the kitchen clear of rats and bugs.",
                "Kneaded pizza dough for every pie.",
                "Crafted homemade marinara sauce daily to ensure fresh flavor.",
            ],
        },
    ],
    projects: [
        {
            title: "Advocates for Pinapple on Pizza",
            month: undefined,
            year: 2003,
            descriptors: [
                "Led seminars to end the descrimination against pinapple-pizza enjoyers.",
                "Passed campus legislation for pineapple to be introduced into the cafeteria."
            ],
        }, {
            title: "Animal Rescue Shelter Volunteer",
            month: "April",
            year: 2002,
            descriptors: [
                "Helped stray cats and dogs to find a home.",
                "Cleaned pens and exercised animals daily."
            ],
        },
    ],
    references: [
        {
            name: "Dr. Jane Oliver",
            relation: "Degree Advisor",
            phone: undefined,
            email: "joliver@nica.edu"
        }, {
            name: "Sarah Smith",
            relation: "College Club President",
            phone: "(111) 222-3334",
            email: "ssmith@nica.edu"
        }, {
            name: "Tiny Tony",
            relation: "Former Boss",
            phone: "(321) 654-0987",
            email: "tiny-tony@example.com"
        }
    ],
};

export default example_resume;