class SlideText extends HTMLElement {
    private text: string;
    private content_element: Element;

    private last_width: number;

    constructor() {
        super();

        const data_text: string[] = JSON.parse(this.dataset.text ?? "[]") as string[];
        const data_separator: string = this.dataset.separator ?? "&nbsp;";
        const data_time: number = Number(this.dataset.time ?? "60");

        this.text = "";
        data_text.forEach((item: string) => {
            this.text += item + data_separator;
        });

        const container: Element | null = this.getElementsByClassName("slide-text-container").item(0);
        const content: Element | null = this.getElementsByClassName("slide-text-content").item(0);

        if (container === null) {
            console.error("SlideText failed to find text container!");
        }
        else {
            const container_html: HTMLElement = container as HTMLElement;

            container_html.style.animationDuration = `${data_time}s`;
            container_html.style.animationDirection = data_time < 0.0 ? "reverse" : "normal";
        }

        if (content === null) {
            console.error("SlideText failed to find text content!");
        }

        this.content_element = content ?? document.createElement("div");

        this.last_width = 0;
        this.onResize();
        window.addEventListener("resize", this.onResize.bind(this));
    }

    private onResize(): void {
        const target_width: number = 2.0 * this.clientWidth;
        if (target_width <= this.last_width) return;

        this.content_element.textContent = this.text;
        const single_width: number = this.content_element.getBoundingClientRect().width;

        if (single_width === 0.0) return;

        const text_count: number = Math.ceil(target_width / single_width);
        this.last_width = text_count * single_width;

        for (let idx = 1; idx < text_count; ++idx) {
            this.content_element.textContent += this.text;
        }
    }
}

customElements.define("slide-text", SlideText);