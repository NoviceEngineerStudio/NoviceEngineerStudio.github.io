function setupNavMenu(): void {
    const nav_menu_modal: Modal | null = document.getElementById("nav-layout-menu-modal") as Modal;
    const nav_menu_button: HTMLElement | null = document.getElementById("nav-layout-menu-button");

    if (nav_menu_modal === null || nav_menu_button === null) return;

    const nav_button_bar_1: HTMLElement | null = nav_menu_button.getElementsByClassName(
        "nav-layout-menu-button-bar-1").item(0) as HTMLElement;
    const nav_button_bar_2: HTMLElement | null = nav_menu_button.getElementsByClassName(
        "nav-layout-menu-button-bar-2").item(0) as HTMLElement;
    const nav_button_bar_3: HTMLElement | null = nav_menu_button.getElementsByClassName(
        "nav-layout-menu-button-bar-3").item(0) as HTMLElement;
    let barCallback = (_is_open: boolean) => {};

    if (
        nav_button_bar_1 !== null &&
        nav_button_bar_2 !== null &&
        nav_button_bar_3 !== null
    ) barCallback = (is_open: boolean) => {
        if (is_open) {
            nav_button_bar_1.style.transform = "translateY(0.525rem) rotate(-45deg)";
            nav_button_bar_2.style.transform = "rotate(45deg)";
            nav_button_bar_3.style.transform = "scaleY(0)";
        }
        else {
            nav_button_bar_1.style.transform = "";
            nav_button_bar_2.style.transform = "";
            nav_button_bar_3.style.transform = "";
        }
    }

    nav_menu_button.addEventListener("click", nav_menu_modal.toggle.bind(nav_menu_modal));
    nav_menu_modal.addChangeEventListener(barCallback);
}

setupNavMenu();