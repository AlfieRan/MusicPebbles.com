export type pebblePhysics = {
    dims: { width: number; height: number };
    pos: { x: number; y: number };
};

export const emptyPebblePhysics: pebblePhysics = {
    dims: { width: 100, height: 100 },
    pos: { x: 0, y: 0 },
};

export type pebbleObjType = {
    profile: pebblePhysics;
    artist: pebblePhysics;
    song: pebblePhysics;
    genre: pebblePhysics;
    unique: pebblePhysics;
    time: pebblePhysics;
};

export type screenType = "small" | "large";
