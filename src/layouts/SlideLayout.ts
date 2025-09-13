type SlideDeckOrientation = "vertical" | "horizontal";

class SlideDeck extends HTMLElement {
    private scroll_behavior: ScrollBehavior;
    private orientation: SlideDeckOrientation;

    private slide_index: number;
    private slides: HTMLElement[];

    private slide_titles: string[];

    constructor() {
        super();

        this.scroll_behavior = (this.dataset.scroll_behavior as ScrollBehavior) ?? "auto";
        this.orientation = (this.dataset.orientation as SlideDeckOrientation) ?? "vertical";

        this.slides = [];
        this.slide_titles = [];
        for (let idx = 0; idx < this.children.length; ++idx) {
            const slide: Element | null = this.children.item(idx);

            if (slide === null) continue;

            const slide_element: HTMLElement = slide as HTMLElement;
            this.slides.push(slide_element);
            this.slide_titles.push(slide_element.dataset.slide_title ?? "");
        }

        this.slide_index = Number(this.dataset.start_index ?? "0");
        window.addEventListener("resize", () => this.selectSlide(this.slide_index));
    }

    public getSlideIndex(): number {
        return this.slide_index;
    }

    public getSlideCount(): number {
        return this.slides.length;
    }

    public getSlideTitle(index: number): string {
        return this.slide_titles[index];
    }

    public canScrollTransition(scroll_delta: number): boolean {
        const slide: HTMLElement = this.slides[this.slide_index];

        const scroll_top: number = slide.scrollTop;
        const scroll_height: number = slide.scrollHeight;
        const client_height: number = slide.clientHeight;

        if (scroll_delta > 0.0) {
            return scroll_top + client_height >= scroll_height;
        }
        else if (scroll_delta < 0.0) {
            return scroll_top <= 0.0;
        }

        return true;
    }

    public selectSlide(index: number): void {
        if (
            index < 0 ||
            index >= this.slides.length
        ) return;

        this.slide_index = index;
        const slide: HTMLElement = this.slides[index];

        const scroll_options: ScrollToOptions = {
            behavior: this.scroll_behavior
        }

        switch (this.orientation) {
            case "vertical":
                scroll_options.top = slide.offsetTop;
                break;
            case "horizontal":
                scroll_options.left = slide.offsetLeft;
                break;
        }

        this.scrollTo(scroll_options);
    }
}

class PageMap extends HTMLElement {
    private last_node_active: HTMLElement | null;
    private onChangeCallbacks: ((index: number) => void)[];

    private map_nodes: HTMLElement[];

    private swipe_start: number;

    constructor() {
        super();

        this.last_node_active = null;
        this.onChangeCallbacks = [];
        this.map_nodes = [];
        this.swipe_start = 0;

        const parent_element: HTMLElement | null = this.parentElement;
        if (parent_element === null) return;

        const slide_deck_element: Element | null = parent_element.getElementsByClassName(
            "slide-layout-slide-deck"
        ).item(0);
        if (slide_deck_element === null) return;

        const slide_deck: SlideDeck = slide_deck_element as SlideDeck;

        const slide_index: number = slide_deck.getSlideIndex();
        const slide_count: number = slide_deck.getSlideCount();

        this.map_nodes = new Array(slide_count) as HTMLElement[];

        for (let idx = 0; idx < slide_count; ++idx) {
            const map_node_container: HTMLDivElement = document.createElement("div");
            map_node_container.classList.add("slide-layout-page-map-node-container")
            this.appendChild(map_node_container);

            const map_node_button: HTMLDivElement = document.createElement("div");
            map_node_button.classList.add("slide-layout-page-map-node-button");
            map_node_container.appendChild(map_node_button);

            const map_node_text: HTMLSpanElement = document.createElement("span");
            map_node_text.classList.add("slide-layout-page-map-node-text");
            map_node_button.appendChild(map_node_text);

            this.map_nodes[idx] = map_node_container;

            map_node_text.textContent = slide_deck.getSlideTitle(idx);

            map_node_container.addEventListener("click", () => {
                if (this.last_node_active !== null) {
                    this.last_node_active.style.backgroundColor = "";
                }

                map_node_button.style.backgroundColor = "#ffffff";

                slide_deck.selectSlide(idx);
                this.last_node_active = map_node_button;

                for (let jdx = 0; jdx < this.onChangeCallbacks.length; ++jdx) {
                    this.onChangeCallbacks[jdx](idx);
                }
            });
        }

        this.map_nodes[slide_index].click();

        window.addEventListener("wheel", (wheel_event: WheelEvent) => {
            const scroll_delta: number = wheel_event.deltaY;

            if (!slide_deck.canScrollTransition(scroll_delta)) return;

            if (wheel_event.cancelable) {
                wheel_event.preventDefault();
            }

            const new_index: number = slide_deck.getSlideIndex() + (
                scroll_delta > 0.0 ? 1 : -1
            );

            if (new_index >= 0 && new_index < this.map_nodes.length) {
                this.map_nodes[new_index].click();
            }
        }, { passive: false });

        window.addEventListener("touchstart", (touch_event: TouchEvent) => {
            this.swipe_start = touch_event.touches[0].clientY;
        });

        window.addEventListener("touchmove", (touch_event: TouchEvent) => {
            const scroll_delta: number = this.swipe_start - touch_event.touches[0].clientY;

            if (!slide_deck.canScrollTransition(scroll_delta)) return;

            if (touch_event.cancelable) {
                touch_event.preventDefault();
            }

            const new_index: number = slide_deck.getSlideIndex() + (
                scroll_delta > 0.0 ? 1 : -1
            );

            if (new_index >= 0 && new_index < this.map_nodes.length) {
                this.map_nodes[new_index].click();
            }
        }, { passive: false });
    }

    public registerChangeCallback(callback: (index: number) => void): void {
        this.onChangeCallbacks.push(callback);
    }
}

customElements.define("slide-deck", SlideDeck);
customElements.define("page-map", PageMap);