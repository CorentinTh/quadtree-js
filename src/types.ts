import {Point} from "./Point";
import {Box} from "./Box";

interface QuadTreeConfig {
    capacity?: number;
    removeEmptyNodes?: boolean;
    maximumDepth?: number | -1;
}

export interface Shape {
    contains(point: Point): boolean;

    intersects(range: Box): boolean;
}

type DeepRequired<T> = {
    [P in keyof Required<T>]: T[P] extends object ? DeepRequired<T[P]> : NonNullable<Required<T[P]>>
}

type QuadTreeConfigComplete = DeepRequired<QuadTreeConfig>;

type Tree = number | {
    ne: number | Tree;
    nw: number | Tree;
    se: number | Tree;
    sw: number | Tree;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UserCustomData = any;

export {
    QuadTreeConfig,
    QuadTreeConfigComplete,
    Shape,
    Tree,
    UserCustomData
}