import RootCanvas, { type RootCanvasCreateInfo } from "./RootCanvas";
import { EffectComposer, OutputPass, RenderPass, type Pass } from "three/examples/jsm/Addons.js";

type PostProcessingPassResizeEvent = (width: number, height: number, pass: Pass) => void;

interface PostProcessingPass {
    pass: Pass;
    onResize?: PostProcessingPassResizeEvent;
}

interface PostProcessingCanvasCreateInfo extends RootCanvasCreateInfo {
    post_processing: {
        passes: PostProcessingPass[];
    }
}

class PostProcessingCanvas extends RootCanvas {
    private effect_composer: EffectComposer;
    private passes: PostProcessingPass[];

    constructor(create_info: PostProcessingCanvasCreateInfo) {
        super(create_info as RootCanvasCreateInfo);

        this.effect_composer = new EffectComposer(this.renderer);

        this.effect_composer.addPass(new RenderPass(
            this.scene_manager.getScene(),
            this.camera_manager.getCamera()
        ));

        this.passes = [...create_info.post_processing.passes];
        for (let idx = 0; idx < this.passes.length; ++idx) {
            this.effect_composer.addPass(this.passes[idx].pass);
        }

        this.effect_composer.addPass(new OutputPass());
    }

    public addPostProcessingPass(pass: PostProcessingPass) {
        this.effect_composer.addPass(pass.pass);
        this.passes.push(pass);
    }

    protected onResize(width: number, height: number): void {
        this.effect_composer.setSize(width, height);
        this.effect_composer.setPixelRatio(window.devicePixelRatio);
        
        for (let idx = 0; idx < this.passes.length; ++idx) {
            const pass: PostProcessingPass = this.passes[idx];

            if (pass.onResize !== undefined) {
                pass.onResize(width, height, pass.pass);
            }
        }
    }

    protected render(delta_time: number): void {
        this.effect_composer.render(delta_time);
    }
}

export { type PostProcessingPassResizeEvent, type PostProcessingPass, type PostProcessingCanvasCreateInfo };
export default PostProcessingCanvas;