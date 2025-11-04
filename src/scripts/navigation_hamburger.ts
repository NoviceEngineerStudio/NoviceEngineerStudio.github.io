const HAMBURGER_BUTTON_ID: string = "nav-hamburger-button";
const HAMBURGER_BAR_1_ID: string = "nav-hamburger-bar-1";
const HAMBURGER_BAR_2_ID: string = "nav-hamburger-bar-2";
const HAMBURGER_BAR_3_ID: string = "nav-hamburger-bar-3";
const HAMBURGER_MENU_ID: string = "nav-hamburger-menu";

const ham_button: HTMLElement | null = document.getElementById(HAMBURGER_BUTTON_ID);
const ham_bar_1: HTMLElement | null = document.getElementById(HAMBURGER_BAR_1_ID);
const ham_bar_2: HTMLElement | null = document.getElementById(HAMBURGER_BAR_2_ID);
const ham_bar_3: HTMLElement | null = document.getElementById(HAMBURGER_BAR_3_ID);
const ham_menu: HTMLElement | null = document.getElementById(HAMBURGER_MENU_ID);

if (
    ham_button === null ||
    ham_bar_1 === null ||
    ham_bar_2 === null ||
    ham_bar_3 === null ||
    ham_menu === null
) {
    throw new Error("Could not find hamburger menu element(s)!");
}

let is_menu_open: boolean = false;

ham_button.addEventListener("click", () => {
    is_menu_open = !is_menu_open;

    if (is_menu_open) {
        ham_menu.style.right = "0";
        ham_bar_1.style.transform = "translateY(0.75rem) rotate(-45deg)";
        ham_bar_2.style.transform = "rotate(45deg)";
        ham_bar_3.style.transform = "scaleY(0)";
    }
    else {
        ham_menu.style.right = "";
        ham_bar_1.style.transform = "";
        ham_bar_2.style.transform = "";
        ham_bar_3.style.transform = "";
    }
});