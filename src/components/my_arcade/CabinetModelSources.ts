import { CabinetModelType } from "./CabinetModelTypes";

interface CabinetMeshSources {
    left_panel: string;
    right_panel: string;
    front_panel: string;
    screen: string;
    sign: string;
    trim: string;
    misc_panels: string;
}

const CLASSIC_SOURCES: CabinetMeshSources = {
    left_panel: "/models/my_arcade/Classic_Left.obj",
    right_panel: "/models/my_arcade/Classic_Right.obj",
    front_panel: "/models/my_arcade/Classic_Front.obj",
    screen: "/models/my_arcade/Classic_Screen.obj",
    sign: "/models/my_arcade/Classic_Sign.obj",
    trim: "/models/my_arcade/Classic_Trim.obj",
    misc_panels: "/models/my_arcade/Classic_Misc.obj"
}

const COCKTAIL_SOURCES: CabinetMeshSources = {
    left_panel: "/models/my_arcade/Classic_Left.obj",
    right_panel: "/models/my_arcade/Classic_Right.obj",
    front_panel: "/models/my_arcade/Classic_Front.obj",
    screen: "/models/my_arcade/Classic_Screen.obj",
    sign: "/models/my_arcade/Classic_Sign.obj",
    trim: "/models/my_arcade/Classic_Trim.obj",
    misc_panels: "/models/my_arcade/Classic_Misc.obj"
}

// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //
// *=================================================
// *
// * Helper Methods
// *
// *=================================================
// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //

function getSources(type: CabinetModelType): CabinetMeshSources {
    switch (type) {
        case CabinetModelType.CLASSIC:
            return CLASSIC_SOURCES;
        case CabinetModelType.COCKTAIL:
            return COCKTAIL_SOURCES;
        default:
            return CLASSIC_SOURCES;
    }
}

export { type CabinetMeshSources };
export default getSources;