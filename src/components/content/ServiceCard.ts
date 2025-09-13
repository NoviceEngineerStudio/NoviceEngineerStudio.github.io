class ServiceCard extends HTMLElement {
    private is_example_menu_open: boolean;

    constructor() {
        super();

        this.is_example_menu_open = this.dataset.examples_open === "true";

        const example_button: Element | null = this.getElementsByClassName("service-example-button").item(0);
        const example_menu: Element | null = this.getElementsByClassName("service-example-menu").item(0);

        const open_text: string = this.dataset.open_text ?? "";
        const close_text: string = this.dataset.close_text ?? "";

        if (example_menu !== null && example_button !== null) {
            const button_element: HTMLElement = example_button as HTMLElement;
            const menu_element: HTMLElement = example_menu as HTMLElement;

            button_element.addEventListener("click", () => {
                this.is_example_menu_open = !this.is_example_menu_open;

                if (this.is_example_menu_open) {
                    button_element.textContent = close_text;

                    menu_element.style.maxHeight = `${menu_element.scrollHeight}px`;
                }
                else {
                    button_element.textContent = open_text;

                    menu_element.style.maxHeight = `${menu_element.scrollHeight}px`;

                    requestAnimationFrame(() => {
                        menu_element.style.maxHeight = "0";
                    });
                }
            });

            menu_element.addEventListener("transitionend", () => {
                if (!this.is_example_menu_open) return;

                menu_element.style.maxHeight = "none";
            });
        }
    }
}

customElements.define("service-card", ServiceCard);