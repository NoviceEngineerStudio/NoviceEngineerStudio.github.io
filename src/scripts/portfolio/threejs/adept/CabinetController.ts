import CabinetView from "./CabinetView";
import CabinetModel from "./CabinetModel";

class CabinetController extends HTMLElement {
    private view: CabinetView;
    private model: CabinetModel;

    constructor() {
        super();

        // ? Create and Configure the Model

        this.model = new CabinetModel();

        // ? Add the Input View and Canvas
        
        const canvas_container: HTMLDivElement = document.createElement("div");
        this.appendChild(canvas_container);
        
        const input_container: HTMLDivElement = document.createElement("div");
        this.appendChild(input_container);

        // ? Create and Configure the View

        this.view = new CabinetView({
            camera_initial_distance: 10.0,
        });

        this.view.attachCanvas(canvas_container);
    }
}

customElements.define("cabinet-controller", CabinetController);

export default CabinetController;