import {Point} from "./Point";
import {Box} from "./Box";

type PointsComparator = <T extends Point>(point1: T, point2: T) => boolean;

interface QuadTreeConfig {
    capacity?: number;
    removeEmptyNodes?: boolean;
    maximumDepth?: number | -1;
    arePointsEqual?: PointsComparator;
}

interface Shape {
    contains(point: Point): boolean;

    intersects(range: Box): boolean;
}

type DeepRequired<T> = T extends Function ? T : (T extends object ? { [P in keyof Required<T>]: DeepRequired<T[P]>; } : NonNullable<Required<T>>);

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