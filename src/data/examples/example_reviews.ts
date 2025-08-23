import type { ReviewData } from "../types/ReviewData";

import example_review_1 from "../../assets/images/examples/example_review_1.webp";
import example_review_2 from "../../assets/images/examples/example_review_2.webp";

const example_reviews: ReviewData[] = [
    {
        picture: example_review_1,
        customer: "Tanya Mc'Nameson",
        stars: 5,
        description: "The pizza was amazing! Shipment took way less time than expected, and was well worth the price. Our family will be ordering again!",
    }, {
        picture: example_review_2,
        customer: "Jake Jackson",
        stars: 4,
        description: "My husband and I are usually very picky eaters, but Lorenzo's pizza was tolerable. Great meal to spice things up between orders of chicken nuggets, french fries, and macaroni and cheese.",
    }
];

export default example_reviews;