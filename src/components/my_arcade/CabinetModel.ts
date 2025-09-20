import * as THREE from "three";

enum JoystickBallShape {
    SPHERE,
    TEARDROP
}

enum CabinetControlOrigin {
    LEFT,
    CENTER,
    RIGHT
}

export { JoystickBallShape, CabinetControlOrigin };

// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //
// *=================================================
// *
// * Helper Methods
// *
// *=================================================
// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //

function fileToTexture(image_file: File, texture_loader: THREE.TextureLoader): THREE.Texture {
    return texture_loader.load(URL.createObjectURL(image_file));
}

export { fileToTexture };

// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //
// *=================================================
// *
// * Cabinet Button
// *
// *=================================================
// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //

interface CabinetButtonCreateInfo {
    base_color: THREE.ColorRepresentation;
    light_color?: THREE.ColorRepresentation;
    face_decal?: File;
}

interface CabinetButtonCosts {
    minimum: number;
    lighting: number;
    face_decal: number;
}

interface CabinetButtonConstraints {
    costs: CabinetButtonCosts;
}

class CabinetButton {
    private constraints: CabinetButtonConstraints;

    private base_color: THREE.Color;

    private has_light: boolean;
    private light_color: THREE.Color;

    private has_face_decal: boolean;
    private face_decal: THREE.Texture;

    constructor(create_info: CabinetButtonCreateInfo, constraints: CabinetButtonConstraints, texture_loader: THREE.TextureLoader) {
        this.constraints = structuredClone(constraints);

        this.base_color = new THREE.Color(create_info.base_color);

        this.has_light = create_info.light_color !== undefined;
        this.light_color = new THREE.Color(
            create_info.light_color !== undefined
            ? create_info.light_color
            : 0xffffff
        );

        this.has_face_decal = create_info.face_decal !== undefined;
        if (create_info.face_decal !== undefined) {
            this.face_decal = fileToTexture(create_info.face_decal, texture_loader);
        }
        else {
            this.face_decal = new THREE.Texture();
        }
    }

    // *=================================================
    // *
    // * Public Getters
    // *
    // *=================================================

    public getConstraints(): CabinetButtonConstraints { return structuredClone(this.constraints); }

    public getBaseColor(): THREE.Color { return this.base_color.clone(); }

    public hasLight(): boolean { return this.has_light; }
    public getLightColor(): THREE.Color { return this.light_color.clone(); }

    public hasFaceDecal(): boolean { return this.has_face_decal; }
    public getFaceDecal(): THREE.Texture { return this.face_decal.clone(); }

    public getCost(): number {
        let cost: number = this.constraints.costs.minimum;

        if (this.has_light) cost += this.constraints.costs.lighting;
        if (this.has_face_decal) cost += this.constraints.costs.face_decal;

        return cost;
    }

    // *=================================================
    // *
    // * Public Setters
    // *
    // *=================================================

    public setConstraints(constraints: CabinetButtonConstraints): void {
        this.constraints = structuredClone(constraints);
    }

    public setBaseColor(color: THREE.ColorRepresentation): void { this.base_color.set(color); }

    public setLightEnabled(enabled: boolean): void { this.has_light = enabled; }
    public setLightColor(color: THREE.ColorRepresentation): void { this.light_color.set(color); }

    public setFaceDecalEnabled(enabled: boolean): void { this.has_face_decal = enabled; }
    public setFaceDecal(image_file: File, texture_loader: THREE.TextureLoader): void {
        this.face_decal = fileToTexture(image_file, texture_loader);
    }
}

export { CabinetButton, type CabinetButtonCreateInfo, type CabinetButtonCosts, type CabinetButtonConstraints };

// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //
// *=================================================
// *
// * Cabinet Player
// *
// *=================================================
// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //

interface CabinetPlayerCreateInfo {
    joystick?: {
        origin: CabinetControlOrigin;
        ball_shape: JoystickBallShape;
        ball_color: THREE.ColorRepresentation;
    };
    buttons_origin: CabinetControlOrigin;
    button_create_infos: CabinetButtonCreateInfo[];
}

interface CabinetPlayerCosts {
    minimum: number;
    joystick: number;
}

interface CabinetPlayerConstraints {
    min_buttons: number;
    max_buttons: number;
    costs: CabinetPlayerCosts;
    button_constraints: CabinetButtonConstraints;
}

class CabinetPlayer {
    private constraints: CabinetPlayerConstraints;

    private has_joystick: boolean;
    private joystick_origin: CabinetControlOrigin;
    private joystick_ball_shape: JoystickBallShape;
    private joystick_ball_color: THREE.Color;

    private button_count: number;
    private buttons_origin: CabinetControlOrigin;
    private button_data: CabinetButton[];

    constructor(create_info: CabinetPlayerCreateInfo, constraints: CabinetPlayerConstraints, texture_loader: THREE.TextureLoader) {
        if (constraints.min_buttons > constraints.max_buttons) {
            throw new Error(`Button count boundaries must have non-zero size: [${constraints.min_buttons}, ${constraints.max_buttons}]!`);
        }

        this.constraints = structuredClone(constraints);

        this.has_joystick = create_info.joystick !== undefined;
        if (create_info.joystick !== undefined) {
            this.joystick_origin = create_info.joystick.origin;
            this.joystick_ball_shape = create_info.joystick.ball_shape;
            this.joystick_ball_color = new THREE.Color(create_info.joystick.ball_color);

            if (this.joystick_origin === create_info.buttons_origin) {
                throw new Error(`Cannot instantiate cabinet player with matching joystick and buttons origin!`);
            }
        }
        else {
            this.joystick_origin = (
                create_info.buttons_origin === CabinetControlOrigin.LEFT
                ? CabinetControlOrigin.RIGHT
                : CabinetControlOrigin.LEFT
            );
            this.joystick_ball_shape = JoystickBallShape.SPHERE;
            this.joystick_ball_color = new THREE.Color(0xff0000);
        }

        this.button_count = create_info.button_create_infos.length;
        this.buttons_origin = create_info.buttons_origin;

        if (this.button_count < constraints.min_buttons || this.button_count > constraints.max_buttons) {
            throw new Error(`Attempting to instantiate player with invalid button count ${this.button_count}! Must be in range [${constraints.min_buttons}, ${constraints.max_buttons}]!`);
        }

        this.button_data = new Array(constraints.max_buttons) as CabinetButton[];

        let idx: number = 0;
        for (; idx < this.button_count; ++idx) {
            this.button_data[idx] = new CabinetButton(
                create_info.button_create_infos[idx],
                constraints.button_constraints,
                texture_loader
            );
        }

        for (; idx < constraints.max_buttons; ++idx) {
            this.button_data[idx] = new CabinetButton({
                base_color: 0xffffff,
                light_color: undefined,
                face_decal: undefined
            }, constraints.button_constraints, texture_loader);
        }
    }

    // *=================================================
    // *
    // * Public Getters
    // *
    // *=================================================

    public getConstraints(): CabinetPlayerConstraints { return structuredClone(this.constraints); }

    public hasJoystick(): boolean { return this.has_joystick; }
    public getJoystickOrigin(): CabinetControlOrigin { return this.joystick_origin; }
    public getJoystickBallShape(): JoystickBallShape { return this.joystick_ball_shape; }
    public getJoystickBallColor(): THREE.Color { return this.joystick_ball_color.clone(); }

    public getButtonCount(): number { return this.button_count; }
    public getButtonsOrigin(): CabinetControlOrigin { return this.buttons_origin; }
    public getButton(index: number): CabinetButton {
        if (index < 0 || index >= this.button_count) {
            throw new Error(`Cabinet button index ${index} out of bounds for size of ${this.button_count}!`);
        }

        return this.button_data[index];
    }
    
    public getCost(): number {
        let cost: number = this.constraints.costs.minimum;

        if (this.has_joystick) cost += this.constraints.costs.joystick;

        for (let idx = 0; idx < this.button_count; ++idx) {
            cost += this.button_data[idx].getCost();
        }

        return cost;
    }

    // *=================================================
    // *
    // * Public Setters
    // *
    // *=================================================

    public setConstraints(constraints: CabinetPlayerConstraints): void {
        if (constraints.min_buttons > constraints.max_buttons) {
            throw new Error(`Button count boundaries must have non-zero size: [${constraints.min_buttons}, ${constraints.max_buttons}]!`);
        }

        this.button_count = Math.max(constraints.min_buttons, Math.min(constraints.max_buttons, this.button_count));
        
        const old_buttons: CabinetButton[] = this.button_data;
        this.button_data = new Array(constraints.max_buttons) as CabinetButton[];

        let idx: number = 0;
        for (; idx < this.button_count; ++idx) {
            this.button_data[idx] = old_buttons[idx];
            this.button_data[idx].setConstraints(constraints.button_constraints);
        }

        for (; idx < constraints.max_buttons; ++idx) {
            this.button_data[idx] = new CabinetButton({
                base_color: 0xffffff,
                light_color: undefined,
                face_decal: undefined
            }, constraints.button_constraints, {} as THREE.TextureLoader);
        }

        this.constraints = structuredClone(constraints);
    }

    public setJoystickEnabled(enabled: boolean): void { this.has_joystick = enabled; }
    public setJoystickOrigin(origin: CabinetControlOrigin): void {
        this.joystick_origin = origin;

        if (this.joystick_origin === this.buttons_origin) {
            this.buttons_origin = (
                this.joystick_origin === CabinetControlOrigin.LEFT
                ? CabinetControlOrigin.RIGHT
                : CabinetControlOrigin.LEFT
            );
        }
    }

    public setJoystickBallShape(shape: JoystickBallShape): void { this.joystick_ball_shape = shape; }
    public setJoystickBallColor(color: THREE.ColorRepresentation): void { this.joystick_ball_color.set(color); }

    public setButtonCount(count: number): void {
        if (count < this.constraints.min_buttons || count > this.constraints.max_buttons) {
            throw new Error(`Cannot set button count to ${count}! Falls outside range [${this.constraints.min_buttons}, ${this.constraints.max_buttons}]!`);
        }

        this.button_count = count;
    }

    public setButtonsOrigin(origin: CabinetControlOrigin): void {
        this.buttons_origin = origin;

        if (this.buttons_origin === this.joystick_origin) {
            this.joystick_origin = (
                this.buttons_origin === CabinetControlOrigin.LEFT
                ? CabinetControlOrigin.RIGHT
                : CabinetControlOrigin.LEFT
            );
        }
    }
}

export { CabinetPlayer, type CabinetPlayerCreateInfo, type CabinetPlayerConstraints, type CabinetPlayerCosts };

// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //
// *=================================================
// *
// * Cabinet Model
// *
// *=================================================
// !-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-! //

interface CabinetModelCreateInfo {
    base_color: THREE.ColorRepresentation;
    trim_color: THREE.ColorRepresentation;
    left_panel_decal?: File;
    right_panel_decal?: File;
    front_panel_decal?: File;
    sign?: {
        decal: File;
        light_color: THREE.ColorRepresentation;
    }
    under_light_color?: THREE.ColorRepresentation;
    has_coin_slot: boolean;
    player_create_infos: CabinetPlayerCreateInfo[];
}

interface CabinetModelCosts {
    minimum: number;
    left_panel_decal: number;
    right_panel_decal: number;
    front_panel_decal: number;
    sign: number;
    under_light: number;
    coin_slot: number;
}

interface CabinetModelConstraints {
    min_players: number;
    max_players: number;
    costs: CabinetModelCosts;
    player_constraints: CabinetPlayerConstraints;
}

class CabinetModel {
    private constraints: CabinetModelConstraints;

    private base_color: THREE.Color;
    private trim_color: THREE.Color;

    private has_left_panel_decal: boolean;
    private has_right_panel_decal: boolean;
    private has_front_panel_decal: boolean;

    private left_panel_decal: THREE.Texture;
    private right_panel_decal: THREE.Texture;
    private front_panel_decal: THREE.Texture;

    private has_sign: boolean;
    private sign_decal: THREE.Texture;
    private sign_light_color: THREE.Color;

    private has_under_light: boolean;
    private under_light_color: THREE.Color;

    private has_coin_slot: boolean;

    private player_count: number;
    private player_data: CabinetPlayer[];

    constructor(create_info: CabinetModelCreateInfo, constraints: CabinetModelConstraints, texture_loader: THREE.TextureLoader) {
        if (constraints.min_players > constraints.max_players) {
            throw new Error(`Player count boundaries must have non-zero size: [${constraints.min_players}, ${constraints.max_players}]!`);
        }

        this.constraints = structuredClone(constraints);

        this.base_color = new THREE.Color(create_info.base_color);
        this.trim_color = new THREE.Color(create_info.trim_color);

        this.has_left_panel_decal = create_info.left_panel_decal !== undefined;
        this.has_right_panel_decal = create_info.right_panel_decal !== undefined;
        this.has_front_panel_decal = create_info.front_panel_decal !== undefined;

        if (create_info.left_panel_decal !== undefined) {
            this.left_panel_decal = fileToTexture(create_info.left_panel_decal, texture_loader);
        }
        else {
            this.left_panel_decal = new THREE.Texture();
        }

        if (create_info.right_panel_decal !== undefined) {
            this.right_panel_decal = fileToTexture(create_info.right_panel_decal, texture_loader);
        }
        else {
            this.right_panel_decal = new THREE.Texture();
        }

        if (create_info.front_panel_decal !== undefined) {
            this.front_panel_decal = fileToTexture(create_info.front_panel_decal, texture_loader);
        }
        else {
            this.front_panel_decal = new THREE.Texture();
        }

        this.has_sign = create_info.sign !== undefined;

        if (create_info.sign !== undefined) {
            this.sign_decal = fileToTexture(create_info.sign.decal, texture_loader);
            this.sign_light_color = new THREE.Color(create_info.sign.light_color);
        }
        else {
            this.sign_decal = new THREE.Texture();
            this.sign_light_color = new THREE.Color(0xffffff);
        }

        this.has_under_light = create_info.under_light_color !== undefined;
        this.under_light_color = new THREE.Color(
            create_info.under_light_color !== undefined
            ? create_info.under_light_color
            : 0xffffff
        );

        this.has_coin_slot = create_info.has_coin_slot;

        this.player_count = create_info.player_create_infos.length;

        if (this.player_count < constraints.min_players || this.player_count > constraints.max_players) {
            throw new Error(`Attempting to instantiate cabinet with invalid player count ${this.player_count}! Must be in range [${constraints.min_players}, ${constraints.max_players}]!`);
        }

        this.player_data = new Array(this.player_count) as CabinetPlayer[];

        let idx: number = 0;
        for (; idx < this.player_count; ++idx) {
            this.player_data[idx] = new CabinetPlayer(
                create_info.player_create_infos[idx],
                constraints.player_constraints,
                texture_loader
            );
        }

        for (; idx < constraints.max_players; ++idx) {
            this.player_data[idx] = new CabinetPlayer({
                joystick: undefined,
                buttons_origin: CabinetControlOrigin.RIGHT,
                button_create_infos: Array.from({ length: constraints.player_constraints.min_buttons }).map(() => ({
                    base_color: 0xff0000,
                    light_color: undefined,
                    face_decal: undefined
                }))
            }, constraints.player_constraints, texture_loader);
        }
    }

    // *=================================================
    // *
    // * Public Getters
    // *
    // *=================================================

    public getConstraints(): CabinetModelConstraints { return structuredClone(this.constraints); }

    public getBaseColor(): THREE.Color { return this.base_color.clone(); }
    public getTrimColor(): THREE.Color { return this.trim_color.clone(); }

    public hasLeftPanelDecal(): boolean { return this.has_left_panel_decal; }
    public hasRightPanelDecal(): boolean { return this.has_right_panel_decal; }
    public hasFrontPanelDecal(): boolean { return this.has_front_panel_decal; }

    public getLeftPanelDecal(): THREE.Texture { return this.left_panel_decal.clone(); }
    public getRightPanelDecal(): THREE.Texture { return this.right_panel_decal.clone(); }
    public getFrontPanelDecal(): THREE.Texture { return this.front_panel_decal.clone(); }

    public hasSign(): boolean { return this.has_sign; }
    public getSignDecal(): THREE.Texture { return this.sign_decal.clone(); }
    public getSignLightColor(): THREE.Color { return this.sign_light_color.clone(); }

    public hasUnderLight(): boolean { return this.has_under_light; }
    public getUnderLightColor(): THREE.Color { return this.under_light_color.clone(); }

    public hasCoinSlot(): boolean { return this.has_coin_slot; }

    public getPlayerCount(): number { return this.player_count; }
    public getPlayer(index: number): CabinetPlayer {
        if (index < 0 || index >= this.player_count) {
            throw new Error(`Cabinet player index ${index} out of bounds for size of ${this.player_count}!`);
        }

        return this.player_data[index];
    }

    public getCost(): number {
        let cost: number = this.constraints.costs.minimum;

        if (this.has_left_panel_decal) cost += this.constraints.costs.left_panel_decal;
        if (this.has_right_panel_decal) cost += this.constraints.costs.right_panel_decal;
        if (this.has_front_panel_decal) cost += this.constraints.costs.front_panel_decal;
        if (this.has_sign) cost += this.constraints.costs.sign;
        if (this.has_under_light) cost += this.constraints.costs.under_light;
        if (this.has_coin_slot) cost += this.constraints.costs.coin_slot;

        for (let idx = 0; idx < this.player_count; ++idx) {
            cost += this.player_data[idx].getCost();
        }

        return cost;
    }

    // *=================================================
    // *
    // * Public Setters
    // *
    // *=================================================

    public setConstraints(constraints: CabinetModelConstraints): void {
        if (constraints.min_players > constraints.max_players) {
            throw new Error(`Player count boundaries must have non-zero size: [${constraints.min_players}, ${constraints.max_players}]!`);
        }

        this.player_count = Math.max(constraints.min_players, Math.min(constraints.max_players, this.player_count));
        
        const old_players: CabinetPlayer[] = this.player_data;
        this.player_data = new Array(constraints.max_players) as CabinetPlayer[];

        let idx: number = 0;
        for (; idx < this.player_count; ++idx) {
            this.player_data[idx] = old_players[idx];
            this.player_data[idx].setConstraints(constraints.player_constraints);
        }

        for (; idx < constraints.max_players; ++idx) {
            this.player_data[idx] = new CabinetPlayer({
                joystick: undefined,
                buttons_origin: CabinetControlOrigin.RIGHT,
                button_create_infos: []
            }, constraints.player_constraints, {} as THREE.TextureLoader);
        }

        this.constraints = structuredClone(constraints);
    }

    public setBaseColor(color: THREE.ColorRepresentation): void { this.base_color.set(color) }
    public setTrimColor(color: THREE.ColorRepresentation): void { this.trim_color.set(color); }

    public setLeftPanelDecalEnabled(enabled: boolean): void { this.has_left_panel_decal = enabled; }
    public setRightPanelDecalEnabled(enabled: boolean): void { this.has_right_panel_decal = enabled; }
    public setFrontPanelDecalEnabled(enabled: boolean): void { this.has_front_panel_decal = enabled; }

    public setLeftPanelDecal(image_file: File, texture_loader: THREE.TextureLoader): void {
        this.left_panel_decal = fileToTexture(image_file, texture_loader);
    }

    public setRightPanelDecal(image_file: File, texture_loader: THREE.TextureLoader): void {
        this.right_panel_decal = fileToTexture(image_file, texture_loader);
    }

    public setFrontPanelDecal(image_file: File, texture_loader: THREE.TextureLoader): void {
        this.front_panel_decal = fileToTexture(image_file, texture_loader);
    }


    public setSignEnabled(enabled: boolean): void { this.has_sign = enabled; }
    public setSignDecal(image_file: File, texture_loader: THREE.TextureLoader): void {
        this.sign_decal = fileToTexture(image_file, texture_loader);
    }

    public setSignLightColor(color: THREE.ColorRepresentation): void { this.sign_light_color.set(color); }

    public setUnderLight(enabled: boolean): void { this.has_under_light = enabled; }
    public setUnderLightColor(color: THREE.ColorRepresentation): void { this.under_light_color.set(color); }

    public setCoinSlotEnabled(enabled: boolean): void { this.has_coin_slot = enabled; }

    public setPlayerCount(count: number): void {
        if (count < this.constraints.min_players || count > this.constraints.max_players) {
            throw new Error(`Cannot set player count to ${count}! Falls outside range [${this.constraints.min_players}, ${this.constraints.max_players}]!`);
        }

        this.player_count = count;
    }
}

export type { CabinetModelConstraints, CabinetModelCreateInfo };
export default CabinetModel;