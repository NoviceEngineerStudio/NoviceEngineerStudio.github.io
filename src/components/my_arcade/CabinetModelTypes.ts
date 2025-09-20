import type { CabinetModelConstraints } from "./CabinetModel";

enum CabinetModelType {
    CLASSIC,
    BARTOP,
    COCKTAIL,

    TYPE_COUNT
}

const CLASSIC_CONSTRAINTS: CabinetModelConstraints = {
    min_players: 1,
    max_players: 4,
    costs: {
        minimum: 325.00,
        left_panel_decal: 65.00,
        right_panel_decal: 65.00,
        front_panel_decal: 45.00,
        sign: 50.00,
        under_light: 30.00,
        coin_slot: 30.00
    },
    player_constraints: {
        min_buttons: 1,
        max_buttons: 6,
        costs: {
            minimum: 15.00,
            joystick: 20.00
        },
        button_constraints: {
            costs: {
                minimum: 5.00,
                lighting: 2.50,
                face_decal: 3.00
            }
        }
    }
}

const BARTOP_CONSTRAINTS: CabinetModelConstraints = {
    min_players: 1,
    max_players: 2,
    costs: {
        minimum: 215.00,
        left_panel_decal: 45.00,
        right_panel_decal: 45.00,
        front_panel_decal: 25.00,
        sign: 50.00,
        under_light: 30.00,
        coin_slot: 30.00
    },
    player_constraints: {
        min_buttons: 1,
        max_buttons: 6,
        costs: {
            minimum: 15.00,
            joystick: 20.00
        },
        button_constraints: {
            costs: {
                minimum: 5.00,
                lighting: 2.50,
                face_decal: 3.00
            }
        }
    }
}

const COCKTAIL_CONSTRAINTS: CabinetModelConstraints = {
    min_players: 2,
    max_players: 2,
    costs: {
        minimum: 430.00,
        left_panel_decal: 35.00,
        right_panel_decal: 35.00,
        front_panel_decal: 50.00,
        sign: 50.00,
        under_light: 40.00,
        coin_slot: 30.00
    },
    player_constraints: {
        min_buttons: 1,
        max_buttons: 4,
        costs: {
            minimum: 15.00,
            joystick: 20.00
        },
        button_constraints: {
            costs: {
                minimum: 5.00,
                lighting: 2.50,
                face_decal: 3.00
            }
        }
    }
}

// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //
// *=================================================
// *
// * Helper Methods
// *
// *=================================================
// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //

function getConstraints(type: CabinetModelType): CabinetModelConstraints {
    switch (type) {
        case CabinetModelType.CLASSIC:
            return CLASSIC_CONSTRAINTS;
        case CabinetModelType.BARTOP:
            return BARTOP_CONSTRAINTS;
        case CabinetModelType.COCKTAIL:
            return COCKTAIL_CONSTRAINTS;
        default:
            return CLASSIC_CONSTRAINTS;
    }
}

export { CabinetModelType };
export default getConstraints;