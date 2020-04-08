import {Box, Point} from './index';
import {QuadTreeConfig, QuadTreeConfigComplete, Tree, Shape} from "./types";

const defaultConfig: QuadTreeConfigComplete = {
    capacity: 4,
    removeEmptyNodes: false,
    maximumDepth: -1
};

/**
 * QuadTree class.
 * @class QuadTree
 */
export class QuadTree {
    private readonly container: Box;
    private isDivided: boolean;
    private points: Point[];
    private readonly config: QuadTreeConfigComplete;
    private ne!: QuadTree;
    private nw!: QuadTree;
    private se!: QuadTree;
    private sw!: QuadTree;

    /**
     * Create a new QuadTree
     * @constructor
     * @param {Box} container - The box on which the QuadTree will operate.
     * @param {Object} [config] - The configuration of the quadtree.
     * @param {number} [config.capacity] - The maximum amount of points per node.
     * @param {boolean} [config.removeEmptyNodes] - Specify if the quadtree has to remove subnodes if they are empty.
     * @param {number} [config.maximumDepth] - Specify the maximum depth of the tree.
     * @param {(Object[]|Point[])} [points] - An array of initial points to insert in the QuadTree.
     * @param {number} points[].x - X coordinate of the point.
     * @param {number} points[].y - Y coordinate of the point.
     */
    constructor(container: Box, config?: QuadTreeConfig, points: Point[] = []) {
        this.container = container;
        this.config = Object.assign({}, defaultConfig, config);

        this.isDivided = false;
        this.points = [];

        for (const point of points) {
            this.insertRecursive(point);
        }
    }

    /**
     * Return a tree representation of the QuadTree
     * @returns {{se: *, sw: *, ne: *, nw: *}|Number} - A tree representation of the QuadTree
     */
    getTree(): Tree {
        let tree;

        if (this.isDivided) {
            tree = {
                ne: this.ne.getTree(),
                nw: this.nw.getTree(),
                se: this.se.getTree(),
                sw: this.sw.getTree()
            };

        } else {
            tree = this.getNodePointAmount();
        }

        return tree;
    }

    /**
     * Get all the points in the QuadTree
     * @returns {(Object[]|Point[])} - An array containing all the points.
     */
    getAllPoints(): Point[] {
        const pointsList: Point[] = [];
        this.getAllPointsRecursive(pointsList);
        return pointsList;
    }

    /**
     * Get all the points in the QuadTree
     * @param {(Object[]|Point[])} pointsList
     * @private
     */
    private getAllPointsRecursive(pointsList: Point[]): void {
        if (!this.isDivided) {
            Array.prototype.push.apply(pointsList, this.points.slice());
            return;
        }

        this.ne.getAllPointsRecursive(pointsList);
        this.nw.getAllPointsRecursive(pointsList);
        this.se.getAllPointsRecursive(pointsList);
        this.sw.getAllPointsRecursive(pointsList);
    }

    /**
     * Return the amount of points in this node.
     * @returns {number} - The amount of points in this node.
     * @private
     */
    private getNodePointAmount(): number {
        return this.points.length;
    }

    /**
     * Divide this node into 4 sub-nodes
     * @private
     */
    private divide(): void {
        const childMaximumDepth = this.config.maximumDepth === -1 ? -1 : this.config.maximumDepth - 1;
        const childConfig = Object.assign({}, this.config, {maximumDepth: childMaximumDepth});

        this.isDivided = true;

        const x = this.container.x;
        const y = this.container.y;
        const w = this.container.w / 2;
        const h = this.container.h / 2;

        // Creation of the sub-nodes, and insertion of the current point
        this.ne = new QuadTree(new Box(x + w, y, w, h), childConfig, this.points.slice());
        this.nw = new QuadTree(new Box(x, y, w, h), childConfig, this.points.slice());
        this.se = new QuadTree(new Box(x + w, y + h, w, h), childConfig, this.points.slice());
        this.sw = new QuadTree(new Box(x, y + h, w, h), childConfig, this.points.slice());

        // We empty this node points
        this.points.length = 0;
        this.points = [];
    }

    /**
     * Remove a point in the QuadTree
     * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to remove
     * @param {number} pointOrArray.x - X coordinate of the point
     * @param {number} pointOrArray.y - Y coordinate of the point
     */
    remove(pointOrArray: Point | Point[]): void {
        if (Array.isArray(pointOrArray)) {
            for (const point of pointOrArray) {
                this.removeRecursive(point);
            }
        } else {
            this.removeRecursive(pointOrArray);
        }
    }

    /**
     * Remove a point in the QuadTree
     * @param {(Point|Object)} point - A point to remove
     * @param {number} point.x - X coordinate of the point
     * @param {number} point.y - Y coordinate of the point
     * @private
     */
    private removeRecursive(point: Point): void {
        if (!this.container.contains(point)) {
            return;
        }

        if (!this.isDivided) {
            const len = this.points.length;
            for (let i = len - 1; i >= 0; i--) {
                if (point.x === this.points[i].x && point.y === this.points[i].y) {
                    this.points.splice(i, 1);
                }
            }

            return;
        }

        this.ne.removeRecursive(point);
        this.nw.removeRecursive(point);
        this.se.removeRecursive(point);
        this.sw.removeRecursive(point);

        if (this.config.removeEmptyNodes) {
            if (this.ne.getNodePointAmount() === 0 && !this.ne.isDivided &&
                this.nw.getNodePointAmount() === 0 && !this.nw.isDivided &&
                this.se.getNodePointAmount() === 0 && !this.se.isDivided &&
                this.sw.getNodePointAmount() === 0 && !this.sw.isDivided) {

                this.isDivided = false;

                delete this.ne;
                delete this.nw;
                delete this.se;
                delete this.sw;
            }
        }
    }

    /**
     * Insert a point in the QuadTree
     * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to insert
     * @param {number} pointOrArray.x - X coordinate of the point
     * @param {number} pointOrArray.y - Y coordinate of the point
     */
    insert(pointOrArray: Point | Point[]): void {
        if (Array.isArray(pointOrArray)) {
            for (const point of pointOrArray) {
                this.insertRecursive(point);
            }
        } else {
            this.insertRecursive(pointOrArray);
        }
    }


    /**
     * Insert a point in the QuadTree
     * @param {(Point|Object)} point - A point to insert
     * @param {number} point.x - X coordinate of the point
     * @param {number} point.y - Y coordinate of the point
     * @returns {boolean}
     * @private
     */
    private insertRecursive(point: Point): boolean {
        if (!this.container.contains(point)) {
            return false;
        }
        if (!this.isDivided) {
            if (this.getNodePointAmount() < this.config.capacity || this.config.maximumDepth === 0) {
                this.points.push(point);
                return true;
            } else if (this.config.maximumDepth === -1 || this.config.maximumDepth > 0) {
                this.divide();
            }

        }

        if (this.isDivided) {
            if (this.ne.insertRecursive(point)) return true;
            if (this.nw.insertRecursive(point)) return true;
            if (this.se.insertRecursive(point)) return true;
            return this.sw.insertRecursive(point);
        } else {
            return false;
        }
    }

    /**
     * Query all the point within a range
     * @param {Shape} range - The range to test
     * @returns {(Point[]|Object[])} - The points within the range
     */
    query(range: Shape): Point[] {
        const pointsFound: Point[] = [];
        this.queryRecursive(range, pointsFound);
        return pointsFound;
    }

    /**
     * @param {Shape} range
     * @param {(Point[]|Object[])} pointsFound
     * @returns {(Point[]|Object[])}
     * @private
     */
    private queryRecursive(range: Shape, pointsFound: Point[]): void {
        if (range.intersects(this.container)) {
            if (this.isDivided) {
                this.ne.queryRecursive(range, pointsFound);
                this.nw.queryRecursive(range, pointsFound);
                this.se.queryRecursive(range, pointsFound);
                this.sw.queryRecursive(range, pointsFound);
            } else {
                const p = this.points.filter((point) => range.contains(point));

                Array.prototype.push.apply(pointsFound, p);
            }
        }
    }

    /**
     * Clear the QuadTree
     */
    clear(): void {
        this.points = [];
        this.isDivided = false;

        delete this.ne;
        delete this.nw;
        delete this.se;
        delete this.sw;
    }
}


