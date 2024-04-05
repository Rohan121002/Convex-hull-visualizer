// <!-- Sparsh Khandelwal 2021A7PS1320H
// Rohan Chavan 2021A7PS2739H
// Mihir Kulkarni 2021A7PS2689H
// Anmol Agarwal 2021A7PS0136H
// Rohit Das 2021A7PS2860H -->
/**
 * Represents a point in the coordinate system.
 * @typedef {Object} Point
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 */

/** Array containing the points added by the user. */
let points = [];

/** Counter for tracking actions performed. */
let count = 0;

/** Index of the current point being processed. */
let currentPointIndex = 0;

/** Array to store points forming the convex hull. */
let hull = [];

/** Array to store line elements on the SVG. */
let lines = [];

/** Array to store actions performed. */
let actions = [];

/** Array to store line elements for median lines on the SVG. */
let medianLines = [];

/** Array to store points that need to be removed. */
let toRemove = [];

/** Set to keep track of already processed points. */
let already = new Set();

/** Controller for aborting asynchronous tasks. */
const controller = new AbortController();

/** Signal used with the controller. */
const signal = controller.signal;

/**
 * Represents details about the rectangular area.
 * @type {Object[]}
 */
let rect_details = [];

/**
 * Handles the click event on the pointsDiv element.
 * @param {MouseEvent} event - The click event object.
 */
document.getElementById('pointsDiv').addEventListener('click', function(event) {
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX;
    let y = event.clientY;
    points.push({ x: x, y: -y });
    drawPoint(x, y, "white", "9", "0");
}, { signal });

/**
 * Draws a line on the SVG.
 * @param {Point} start - The starting point of the line.
 * @param {Point} end - The ending point of the line.
 * @param {string} color - The color of the line.
 */
function drawLine(start, end, color) {
    // Implementation code for drawing a line on the SVG
}

/**
 * Draws a median line on the SVG.
 * @param {Point} start - The starting point of the median line.
 * @param {Point} end - The ending point of the median line.
 */
function medianDrawLine(start, end) {
    // Implementation code for drawing a median line on the SVG
}

/**
 * Draws a point on the screen.
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @param {string} color - The color of the point.
 * @param {string} radius - The radius of the point.
 * @param {string} dis - The displacement of the point.
 */
function drawPoint(x, y, color, radius, dis) {
    // Implementation code for drawing a point on the screen
}

/**
 * Removes the last drawn median line from the SVG.
 */
function removeMedianLine() {
    // Implementation code for removing the last drawn median line from the SVG
}

/**
 * Removes a line from the SVG.
 * @param {Point} start - The starting point of the line to be removed.
 * @param {Point} end - The ending point of the line to be removed.
 */
function removeLine(start, end) {
    // Implementation code for removing a line from the SVG
}

/**
 * Keeps only unique elements in an array of points.
 * @param {Point[]} array - The array of points to filter.
 * @returns {Point[]} - The array with unique points.
 */
function keepUniqueElements(array) {
    // Implementation code for keeping only unique elements in the array
}

/**
 * Finds the minimum and maximum points in a given set of points.
 * @param {Point[]} points - The array of points.
 * @returns {Object} - Object containing minimum and maximum points.
 */
function findminmax(points) {
    // Implementation code for finding the minimum and maximum points
}

/**
 * Removes lower points from the set of points based on given criteria.
 * @param {Point[]} Lower - The array of lower points.
 * @param {Point} plmin - The minimum point in the lower set.
 * @param {Point} plmax - The maximum point in the lower set.
 */
function removeLowerPoints(Lower, plmin, plmax) {
    // Implementation code for removing lower points from the set
}

/**
 * Removes points from the set based on specified criteria.
 * @param {Point[]} ptsToRemove - The array of points to be removed.
 */
function removePoints(ptsToRemove) {
    // Implementation code for removing points from the set
}

/**
 * Calculates the Euclidean distance between two points.
 * @param {Point} p1 - The first point.
 * @param {Point} p2 - The second point.
 * @returns {number} - The Euclidean distance between the points.
 */
function distance(p1, p2) {
    // Implementation code for calculating Euclidean distance
}

/**
 *Jarvis's March, also known as the Gift Wrapping Algorithm,
 *is a method used to compute the convex hull of a set of points
 *in a plane. Similar to Graham's scan algorithm, Jarvis's March 
 *is an efficient technique for finding the smallest convex polygon
 *that encloses a given set of points.
 *Here's an overview of how Jarvis's March algorithm works:
 *Select the Starting Point:
*Begin by selecting the point with the lowest y-coordinate (and leftmost if there are ties) as the starting point.
 *This point is often referred to as the "anchor" or "pivot" point.
* Iterative Process:
*The algorithm iteratively selects the next point on the convex hull by
* examining all other points in the set. It tries to find the point that 
*forms the smallest counterclockwise angle with the current point and the positive x-axis.
*Update the Convex Hull:
*After finding the next point, add it to the convex hull. Then, use this newly added point as the reference for the next iteration.

*Repeat Until Complete:
*Continue this process until the next point coincides with the starting point (i.e., the convex hull is closed).

*Finalize the Convex Hull:
*After completing the iterations, the convex hull is finalized. This may involve removing duplicate or collinear points to ensure that the convex hull is represented by a sequence of distinct vertices in counterclockwise order.

*Jarvis's March algorithm is straightforward to implement and has a time complexity of O(nh), where n is the number of input points and h is the number of points on the convex hull. It guarantees correctness in finding the convex hull but may be less efficient than other algorithms like Graham's scan for large point sets due to its quadratic worst-case time complexity.







 * @param {Point[]} points - The array of points for which to compute the convex hull.
 * @returns {Point[]} - The array of points forming the convex hull.
 */
function ConvexHull(points) {
    // Implementation code for computing the convex hull using Graham scan
}

// Add event listeners and other functionality as needed
