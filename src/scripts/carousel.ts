const CAROUSEL_SCROLL_PANE_ID: string = "carousel-scroll-pane";
const CAROUSEL_CONTENT_RAIL_ID: string = "carousel-content-rail";
const CAROUSEL_SCROLL_DOT_CONTAINER_ID: string = "carousel-scroll-dot-container";

const CAROUSEL_AUTO_SCROLL_TIME_MS: number = 5000;

class Carousel extends HTMLElement {
    private scroll_pane: HTMLElement = this.getElementByClassName(CAROUSEL_SCROLL_PANE_ID);
    private content_rail: HTMLElement = this.getElementByClassName(CAROUSEL_CONTENT_RAIL_ID);
    private scroll_dot_container: HTMLElement = this.getElementByClassName(CAROUSEL_SCROLL_DOT_CONTAINER_ID);

    private is_auto_scrolling: boolean = false;
    private auto_scroll_interval_id: NodeJS.Timeout | null = null;

    private scroll_index: number = 0;
    private scroll_dots: HTMLDivElement[] = [];
    private scroll_elements: HTMLElement[] = [];

    constructor() {
        super();

        for (let idx = 0; idx < this.content_rail.childElementCount; ++idx) {
            const scroll_element: HTMLElement | null = this.content_rail.children.item(idx) as HTMLElement;

            if (scroll_element === null) {
                continue;
            }

            this.scroll_elements.push(scroll_element);

            const scroll_dot: HTMLDivElement = document.createElement("div");
            this.scroll_dot_container.appendChild(scroll_dot);
            this.scroll_dots.push(scroll_dot);

            scroll_dot.addEventListener("click", () => {
                this.scrollToElement(scroll_element);
            });
        }

        if (this.scroll_dots.length === 0) {
            return;
        }

        this.scroll_dots[this.scroll_index].style.setProperty("background-color", "var(--color-text-bright)", "important");

        this.auto_scroll_interval_id = setInterval(() => {
            this.is_auto_scrolling = true;
            this.scrollToElement(this.scroll_elements[(this.scroll_index + 1) % this.scroll_dots.length]);
        }, CAROUSEL_AUTO_SCROLL_TIME_MS);

        this.scroll_pane.addEventListener("scrollend", () => {
            this.scroll_dots[this.scroll_index].style.removeProperty("background-color");

            if (this.auto_scroll_interval_id !== null && !this.is_auto_scrolling) {
                clearInterval(this.auto_scroll_interval_id);
                this.auto_scroll_interval_id = null;
            }
            
            this.is_auto_scrolling = false;

            let closest_index: number = 0
            const window_center: number = window.innerWidth * 0.5;

            let element_rect: DOMRect = this.scroll_elements[closest_index].getBoundingClientRect();
            let closest_distance: number = Math.abs(window_center - (element_rect.left + element_rect.width * 0.5));
            
            for (let idx = 1; idx < this.scroll_elements.length; ++idx) {
                element_rect = this.scroll_elements[idx].getBoundingClientRect();
                const current_distance: number = Math.abs(window_center - (element_rect.left + element_rect.width * 0.5));

                if (closest_distance < current_distance) {
                    continue;
                }

                closest_index = idx;
                closest_distance = current_distance;
            }

            this.scroll_index = closest_index;
            this.scroll_dots[this.scroll_index].style.setProperty("background-color", "var(--color-text-bright)", "important");
        });
    }

    private scrollToElement(element: HTMLElement): void {
        const scroll_pane_rect: DOMRect = this.scroll_pane.getBoundingClientRect();
        const element_rect: DOMRect = element.getBoundingClientRect();

        this.scroll_pane.scrollTo({
            left: element_rect.left - scroll_pane_rect.left + this.scroll_pane.scrollLeft + 0.5 * (element_rect.width - scroll_pane_rect.width),
            behavior: "smooth"
        });
    }

    private getElementByClassName(class_name: string): HTMLElement {
        const candidates: HTMLCollectionOf<Element> = this.getElementsByClassName(class_name);

        if (candidates.length === 0) {
            throw new Error(`Carousel could not find class name ${class_name}!`);
        }

        const candidate: HTMLElement | null = candidates.item(0) as HTMLElement;

        if (candidate === null) {
            throw new Error(`Carousel element with class name ${class_name} is NULL!`);
        }

        return candidate;
    }
};

customElements.define("carousel-container", Carousel);