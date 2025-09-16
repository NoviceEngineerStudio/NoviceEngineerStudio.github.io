type ModalChangeEventListener = ((is_open: boolean) => void);

class Modal extends HTMLElement {
    private overlay: HTMLElement;
    private container: HTMLElement;

    private is_open: boolean;

    private change_listeners: ModalChangeEventListener[];

    constructor() {
        super();

        const overlay_element: Element | null = this.getElementsByClassName("modal-fade-overlay").item(0);
        const container_element: Element | null = this.getElementsByClassName("modal-menu-container").item(0);

        if (overlay_element === null || container_element === null) {
            throw new Error("Modal cannot find internal elements!");
        }

        this.overlay = overlay_element as HTMLElement;
        this.container = container_element as HTMLElement;

        this.is_open = false;
        this.change_listeners = [];

        this.overlay.addEventListener("transitionend", () => {
            if (this.is_open) return;

            this.overlay.style.display = "none";
            this.container.style.display = "none";
        });

        this.overlay.addEventListener("click", () => {
            if (this.is_open) this.toggle();
        });
    }

    public toggle(): void {
        this.is_open = !this.is_open;

        if (this.is_open) {
            this.overlay.style.display = "";
            this.container.style.display = "";

            requestAnimationFrame(() => {
                if (!this.is_open) return;
                this.overlay.style.backgroundColor = "";
                this.container.style.opacity = "";
            });
        }
        else {
            this.overlay.style.backgroundColor = "transparent";
            this.container.style.opacity = "0";
        }

        for (let idx = 0; idx < this.change_listeners.length; ++idx) {
            this.change_listeners[idx](this.is_open);
        }
    }

    public isOpen(): boolean {
        return this.is_open;
    }

    public addChangeEventListener(listener: ModalChangeEventListener): void {
        this.change_listeners.push(listener);
    }

    public removeChangeEventListener(listener: ModalChangeEventListener): void {
        const remove_index: number = this.change_listeners.indexOf(listener);
        if (remove_index < 0) return;

        this.change_listeners.splice(remove_index, 1);
    }
}

customElements.define("modal-element", Modal);