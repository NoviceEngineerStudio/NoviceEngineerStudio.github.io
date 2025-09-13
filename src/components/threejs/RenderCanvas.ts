import RootCanvas, { type RootCanvasCreateInfo } from "./RootCanvas";

interface RenderCanvasCreateInfo extends RootCanvasCreateInfo {}

class RenderCanvas extends RootCanvas {
    constructor(create_info: RenderCanvasCreateInfo) {
        super(create_info as RootCanvasCreateInfo);
    }

    protected override onResize(_width: number, _height: number): void {}

    protected override render(_delta_time: number): void {
        this.renderer.render(
            this.scene_manager.getScene(),
            this.camera_manager.getCamera()
        );
    }
}

export { type RootCanvasCreateInfo };
export default RenderCanvas;