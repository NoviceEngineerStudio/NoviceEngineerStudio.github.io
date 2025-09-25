const TABLE_SIZE: number = 256;

class Perlin {
    private seed: number = 0;
    private seed_counter: number = 0;

    private permutation_table: number[] = new Array(0) as number[];

    constructor(seed: number) {
        this.updateSeed(seed);
    }

    private random(): number {
        let t = this.seed + 0x6D2B79F5 + this.seed_counter;
        ++this.seed_counter;

        t = Math.imul( t ^ t >>> 15, t | 1 );

        t ^= t + Math.imul( t ^ t >>> 7, t | 61 );
        
        return ( ( t ^ t >>> 14 ) >>> 0 ) / 4294967296;
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    private gradient(hash: number, x: number, y: number): number {
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;

        return (
            ((h & 1) === 0 ? u : -u) +
            ((h & 2) === 0 ? v : -v)
        );
    }

    public noise(x: number, y: number): number {
        const X: number = Math.floor(x) & (TABLE_SIZE - 1);
        const Y: number = Math.floor(y) & (TABLE_SIZE - 1);

        const xf: number = x - Math.floor(x);
        const yf: number = y - Math.floor(y);

        const u: number = this.fade(xf);
        const v: number = this.fade(yf);

        const tl: number = this.permutation_table[
            this.permutation_table[X] + Y
        ];
        const tr: number = this.permutation_table[
            this.permutation_table[X] + Y + 1
        ];
        const bl: number = this.permutation_table[
            this.permutation_table[X + 1] + Y
        ];
        const br: number = this.permutation_table[
            this.permutation_table[X + 1] + Y + 1
        ];

        const na: number = this.lerp(this.gradient(tl, xf, yf), this.gradient(bl, xf - 1, yf), u);
        const nb: number = this.lerp(this.gradient(tr, xf, yf - 1), this.gradient(br, xf - 1, yf - 1), u);

        return (1.0 + this.lerp(na, nb, v)) * 0.5;
    }

    public updateSeed(seed: number): void {
        this.seed = seed;
        this.seed_counter = 0;
        
        this.permutation_table = Array.from({ length: TABLE_SIZE * 2 }, (_, idx) => idx % TABLE_SIZE);

        for (let idx = TABLE_SIZE - 1; idx > 0; --idx) {
            const jdx = Math.floor(this.random() * (idx + 1));
            [
                this.permutation_table[idx],
                this.permutation_table[jdx]
            ] = [
                this.permutation_table[jdx],
                this.permutation_table[idx]
            ];

            [
                this.permutation_table[idx + TABLE_SIZE],
                this.permutation_table[jdx + TABLE_SIZE]
            ] = [
                this.permutation_table[jdx + TABLE_SIZE],
                this.permutation_table[idx + TABLE_SIZE]
            ];
        }
    }

    public resetSeedCounter(): void {
        this.seed_counter = 0;
    }
}

export default Perlin;