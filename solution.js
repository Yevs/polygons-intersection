;var intersects = (function () {

    /**
     * @typedef {{x: Number, y: Number}} Vector
     * @typedef {{x: Number, y: Number}} Point
     */

    /**
     * Represents a 2d mathematical vector
     * @constructor
     * @param x {Number} x-coordinate
     * @param y {Number} y-coordinate
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    };


    /**
     * @returns {Number} vector length
     */
    Vector.prototype.length = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    };

    /**
     * @returns {Vector} new opposite to instance
     */
    Vector.prototype.negative = function() {
        return new Vector(-this.x, -this.y);
    };

    /**
     * @param vector {Vector} other vector for scalar product
     * @returns {Number} scalar product of two vectors
     */
    Vector.prototype.scalarProduct = function(vector) {
        return this.x * vector.x + this.y * vector.y;
    };


    /**
     * @param vector {Vector} other vector for cross product
     * @returns {Number} signed modulo of cross product
     */
    Vector.prototype.crossProduct = function(vector) {
        return this.x * vector.y - vector.x * this.y;
    };

    /**
     * @param scalar {Number} a number to be multipied by vector
     * @return {Vector} new vector which is scalar times longer
     */
    Vector.prototype.multiply = function(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    };

    /**
     * @param vector {Vector} another vector for adding two vectors
     * @returns {Vector} new vector equal to sum of two vectors
     */
    Vector.prototype.add = function(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };

    /**
     * @param {Point} pointA
     * @param {Point} pointB
     * @returns {boolean} true if points are equal, false otherwise
     */
    function pointsEqual(pointA, pointB) {
        return pointA.x == pointB.x && pointA.y == pointB.y;
    };

    /**
     * Finds index of item in array using callback as comparator.
     * Finds only first index.
     * If not found returns -1;
     * @param arr array of valuse
     * @param item whose index item to be found
     * @param cb callback comparator
     * @returns index of item in array, -1 if there is no such item
     */
    function indexOf(arr, item, cb) {
        for (var i = 0; i < arr.length; i++) {
            if (cb(arr[i], item)) {
                return i;
            }
        }
        return -1;
    };


    /**
     * Returns true if simple polygon is clockwise oriented
     * false otherwise
     * @param polygon {Point[]} polygon as array of points
     * @return {boolean} true if clockwise oriented, false otherwise
     */
    function isClockwise(polygon) {
        var sum = 0;
        for (var i = 0; i < polygon.length; i++) {
            var current_vertex = polygon[i];
            var next_vertex = polygon[(i+1) % polygon.length];
            sum += (next_vertex.x - current_vertex.x) *
                   (next_vertex.y + current_vertex.y);
        }
        return sum > 0;
    };

    /**
     * @param point {Point}
     * @param edge {Point[]} array with two points in it
     * @returns {boolean} true if point lies on edge, false otherwise
     */
    function isOnEdge(point, edge) {
        var edgeVector = new Vector(edge[1].x-edge[0].x, edge[1].y-edge[0].y);
        var pointVector = new Vector(point.x-edge[0].x, point.y-edge[0].y);
        return (edgeVector.crossProduct(pointVector) == 0) &&
               (edgeVector.scalarProduct(pointVector) >= 0) &&
               (edgeVector.scalarProduct(pointVector) <=
                    edgeVector.scalarProduct(edgeVector));
    };

    /**
     * Returns true if point is inside of simple polygon or on one of its edges.
     * Returns false otherwise.
     * @param point {Point}
     * @param polygon {Point[]} polygon as array of points
     * @returns {boolean} true if point lies in polygon
     */
    function isInside(point, polygon) {
        var inside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            // points equal?
            if (pointsEqual(point, polygon[i])) {
                return true;
            }
            // lies on edge?
            if (isOnEdge(point, [polygon[j], polygon[i]])) {
                return true;
            }
            // inside?
            if (((polygon[i].y > point.y) != (polygon[j].y > point.y)) &&
                (point.x <
                    (polygon[j].x - polygon[i].x) *
                    (point.y-polygon[i].y) /
                    (polygon[j].y-polygon[i].y) +
                    polygon[i].x)) {
                inside = !inside;
            }
        }
        return inside;
    };


    /**
     * Checks if all vertices of first polygon lie in second
     * @param polygonA {Point[]} first polygon
     * @param polygonB {Point[]} second polygon
     * @returns {boolean}
     */
    function isPolyPointsInside(polygonA, polygonB) {
        for (var i = 0; i < polygonA.length; i++) {
            for (var j = 0; j < polygonB.length; j++) {
                if (!isInside(polygonA[i], polygonB)) {
                    return false;
                }
            }
        }
        return true;
    };


    /**
     * Finds intersection of two line segments
     * @param segmentA {Point[]} first line segment as array with two points
     * @param segmentB {Point[]} second line segment as array with two points
     * @returns {?Point} returns intersection or null if theres is no such
     */
    function segmentIntersection(segmentA, segmentB) {
        var vectorAA = new Vector(segmentA[0].x, segmentA[0].y);
        var vectorAB = new Vector(segmentA[1].x, segmentA[1].y);
        var vectorBA = new Vector(segmentB[0].x, segmentB[0].y);
        var vectorBB = new Vector(segmentB[1].x, segmentB[1].y);
        var dirA = vectorAB.add(vectorAA.negative());
        var dirB = vectorBB.add(vectorBA.negative());
        if (dirA.crossProduct(dirB) === 0) {
            return null;  // parallel
        } else {
            var t = vectorBA.add(vectorAA.negative()).crossProduct(dirB) /
                    dirA.crossProduct(dirB);
            var u = vectorBA.add(vectorAA.negative()).crossProduct(dirA) /
                    dirA.crossProduct(dirB);
            if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
                var result = vectorAA.add(dirA.multiply(t));
                return {
                    x: result.x,
                    y: result.y
                };
            } else {
                return null;  // do not intersect
            }
        }
    };


    /**
     * @param vertex {Point} a polygon vertex
     * @returs {String} key to be used for js dictionary (Object)
     */
    function getKey(vertex) {
        return JSON.stringify(vertex);
    };


    /**
     * Constructs edges out of simple polygon reprsented as array of points
     * @param polygon {Point[]}
     * @returns array of edges
     */
    function getEdges(polygon) {
        var edges = [];
        for (var i = 0; i < polygon.length; i++) {
            edges.push([polygon[i], polygon[(i+1) % polygon.length]]);
        }
        return edges;
    };


    /**
     * Walks through part of non-simple polygon yielding simple polygon
     * e.g.
     * this
     * --
     * \/
     * /\
     * --
     * may yield
     * --
     * \/
     * or
     * /\
     * --
     * depending on starting vertex
     * @param start_vertex {Number} index of starting vertex of polygon
     * @param vertices js object which stores vertices of polygon and all
     * edges coming out of each vertex
     * @returns {Point[]} simple polygon
     */
    function traverse(start_vertex, vertices) {
        var polygon = [start_vertex];
        var current_vertex = vertices[getKey(start_vertex)].pop();
        while (!pointsEqual(current_vertex, start_vertex)) {
            polygon.push(current_vertex);
            current_vertex = vertices[getKey(current_vertex)].pop();
        }
        return polygon;
    };


    /**
     * Makes array of simple polygons out of non-simple polygon
     * @param polygon {Point[]} polygon as array of points
     * @return {Point[][]} simple polygons
     */
    function makeSimplePolygons(polygon) {
        var vertices = {};
        for (var i = 0; i < polygon.length; i++) {
            if (getKey(polygon[i][0]) in vertices) {
                vertices[getKey(polygon[i][0])].push(polygon[i][1]);
            } else {
                vertices[getKey(polygon[i][0])] = [polygon[i][1]];
            }
        }
        var edges_left = true;
        var start_vertex;
        var result = [];
        while (edges_left) {
            edges_left = false;
            for (var vertex in vertices) {
                if (vertices[vertex].length == 1) {
                    start_vertex = JSON.parse(vertex);
                    edges_left = true;
                    result.push(traverse(start_vertex, vertices));
                    break;
                }
            }
        }
        return result;
    };


    /**
     * Returns self-intersections of non-simple polygon, sorted in order they appear
     * @param edges edges of polygon
     * @returns {Point[][]} array of self-intersections points for each edge
     */
    function getIntersectionPoints(edges) {
        var intersection_pts = new Array(edges.length);
        for (var i = 0; i < intersection_pts.length; i++) {
            intersection_pts[i] = [];
        }
        for (var i = 0; i < edges.length; i++) {
            for (var j = 0; j < edges.length; j++) {
                if (i == j ||
                    pointsEqual(edges[i][0], edges[j][0]) ||
                    pointsEqual(edges[i][0], edges[j][1]) ||
                    pointsEqual(edges[i][1], edges[j][0]) ||
                    pointsEqual(edges[i][1], edges[j][1])) {
                    continue;
                }
                var intersection = segmentIntersection(edges[i], edges[j]);
                if (intersection != null) {  // intersection exists
                    if (indexOf(intersection_pts[i], intersection, pointsEqual) < 0) {
                        intersection_pts[i].push(intersection);
                    }
                    if (indexOf(intersection_pts[j], intersection, pointsEqual) < 0) {
                        intersection_pts[j].push(intersection);
                    }
                }
            }
        }
        for (var i = 0; i < intersection_pts.length; i++) {
            intersection_pts[i].sort(function(pointA, pointB) {
                var VectorA = new Vector(pointA.x - edges[i][0].x,
                                     pointA.y - edges[i][0].y);
                var VectorB = new Vector(pointB.x - edges[i][0].x,
                                     pointB.y - edges[i][0].y);
                var lenA = VectorA.length();
                var lenB = VectorB.length();
                if (lenA > lenB) {
                    return 1;
                } else if (lenA == lenB) {
                    return 0;  // must not happen if polygon is valid
                } else {
                    return -1;
                }
            });
        }
        return intersection_pts;
    };


    /**
     * Splits self intersecting non-simple polygon into simple
     * @param {Point[]} polygon as array of points
     * @returns {Point[][]} simple polygons
     */
    function split(polygon) {
        var edges = getEdges(polygon);
        var intersection_pts = getIntersectionPoints(edges);
        var result = [];
        for (var i = 0; i < edges.length; i++) {
            if (intersection_pts[i].length == 0) {
                result.push(edges[i]);
            } else {
                for (var j = 0; j < intersection_pts[i].length; j++) {
                    if (j == 0) {
                        result.push([edges[i][0], intersection_pts[i][0]]);
                    }
                    if (j == intersection_pts[i].length - 1) {
                        result.push([intersection_pts[i][j], edges[i][1]]);
                    } else {
                        result.push([intersection_pts[i][j], intersection_pts[i][j+1]]);
                    }
                }
            }
        }
        return makeSimplePolygons(result);
    };


    /**
     * Finds intersection points for two simple polygons
     * @param polygonA {Point[]} first polygon
     * @param polygonB {Point[]} second polygon
     * @returns points where first polygon intersects,
     *          points where second polygon intersects,
     *          array which indicates if vertices of first
     *          polygon are intersection points,
     *          array which indicates if vertices of second
     *          polygon are intersection points,
     *          flag which indicates if it is degenerate case
     */
    function intersectionMarks(polygonA, polygonB) {
        var vertexAsIntersectionsA = (new Array(polygonA.length)).map(function (_) {
            return false;
        });
        var vertexAsIntersectionsB = (new Array(polygonB.length)).map(function (_) {
            return false;
        });
        var intersectionA = new Array(polygonA.length);
        var intersectionB = new Array(polygonB.length);
        // getting intersections
        for (var i = 0; i < intersectionA.length; i++) {
            intersectionA[i] = [];
        }
        for (var j = 0; j < intersectionB.length; j++) {
            intersectionB[j] = [];
        }
        var degenerate = true;
        for (var i = 0; i < polygonA.length; i++) {
            var edgeA = [polygonA[i], polygonA[(i+1) % polygonA.length]];
            for (var j = 0; j < polygonB.length; j++) {
                var edgeB = [polygonB[j], polygonB[(j+1) % polygonB.length]];
                var intersection = segmentIntersection(edgeA, edgeB);
                if (intersection != null) {
                    degenerate = degenerate && !((!pointsEqual(intersection, edgeA[0]) && !pointsEqual(intersection, edgeA[1])) ||
                                                 (!pointsEqual(intersection, edgeB[0]) && !pointsEqual(intersection, edgeB[1])))
                    if (pointsEqual(intersection, edgeA[0])) {
                        vertexAsIntersectionsA[i] = true;
                    } else if (pointsEqual(intersection, edgeA[1])) {
                        vertexAsIntersectionsA[(i+1) % polygonA.length] = true;
                    }
                    if (pointsEqual(intersection, edgeB[0])) {
                        vertexAsIntersectionsB[j] = true;
                    } else if (pointsEqual(intersection, edgeB[1])) {
                        vertexAsIntersectionsB[(j+1) % polygonB.length] = true;
                    }
                    if (!pointsEqual(intersection, edgeA[0]) &&
                        !pointsEqual(intersection, edgeA[1])) {
                        intersectionA[i].push({point: intersection,
                                               isIntersection: true});
                    }
                    if (!pointsEqual(intersection, edgeB[0]) &&
                        !pointsEqual(intersection, edgeB[1])) {
                        intersectionB[j].push({point: intersection,
                                               isIntersection: true});
                    }
                }
            }
        }
        return [intersectionA, intersectionB,
                vertexAsIntersectionsA, vertexAsIntersectionsB,
                degenerate];
    }


    /**
     * Returns function for sorting intersection points by how
     * far are they from vertex
     * @param vertex {Point} vertex itself
     * @returns comparator function
     */
    function sortFunction(vertex) {
        return function(pointA_, pointB_) {
            var pointA = pointA_.point;
            var pointB = pointB_.point;
            var VectorA = new Vector(pointA.x - vertex.x,
                                 pointA.y - vertex.y);
            var VectorB = new Vector(pointB.x - vertex.x,
                                 pointB.y - vertex.y);
            var lenA = VectorA.length();
            var lenB = VectorB.length();
            if (lenA > lenB) {
                return 1;
            } else if (lenA == lenB) {
                return 0;  // must not happen if polygon is valid
            } else {
                return -1;
            }
        }
    }


    /**
     * Given a simple polygon, its intersections with other polygon,
     * and marking if its vertices are intersections
     * constructs a new polygon with intersection points inserted as
     * intermediate points and labeled
     * @param polygon {Point[]} polygon itself
     * @param intersection intersections with other polygons
     * @param vertexAsIntersection {boolean[]} marks for vertices if they
     *                                         are intersections with other polygon
     * @returns newly formed polygon
     */
    function makePoly(polygon, intersections, vertexAsIntersection) {
        var newPoly = [];
        for (var i = 0; i < intersections.length; i++) {
            newPoly.push({point: polygon[i],
                           isIntersection: vertexAsIntersection[i]});
            if (intersections[i].length > 0) {
                intersections[i].sort(sortFunction(polygon[i]));
                for (var j = 0; j < intersections[i].length; j++) {
                    if (!pointsEqual(intersections[i][j].point, newPoly[newPoly.length-1].point)) {
                        newPoly.push(intersections[i][j]);
                    }
                }
            }
        }
        return newPoly;
    }


    /**
     * Constructs two new polygons out of two simple polygons
     * with intermediate intersection points inserted
     * @param polygonA {Point[]} first polygon
     * @param polygonB {Point[]} second polygon
     * @returns new polygon A, new polygon B,
     *          old polygon A, old polygon B,
     *          flag detecting if it is degenerate case
     */
    function makePolies(polygonA, polygonB) {
        if (!isClockwise(polygonA)) {
            polygonA = polygonA.reverse();
        }
        if (!isClockwise(polygonB)) {
            polygonB = polygonB.reverse();
        }
        var polygonsIntersections = intersectionMarks(polygonA, polygonB);
        var intersectionA = polygonsIntersections[0],
            intersectionB = polygonsIntersections[1],
            vertexAsIntersectionsA = polygonsIntersections[2],
            vertexAsIntersectionsB = polygonsIntersections[3],
            degenerate = polygonsIntersections[4];
        // forming newPolyA
        var newPolyA = makePoly(polygonA, intersectionA, vertexAsIntersectionsA);
        var newPolyB = makePoly(polygonB, intersectionB, vertexAsIntersectionsB);
        return [newPolyA, newPolyB, polygonA, polygonB, degenerate];
    };


    /**
     * Implementation of weiler-atherthon algorithm which yields intersection
     * @param polygonA {Point[]} first polygon
     * @param polygonB {Point[]} second polygon
     * @param start_ver {Point} intersection point of first polygon from which traversing starts
     * @param used {boolean[]} marks of used vertices of first polygon
     */
    function traverseIntersection(polygonA, polygonB, start_ver, used) {
        var res = [];
        var cur_ver = start_ver;
        var cur_poly = polygonA;
        do {
            if (cur_poly == polygonA) {
                used[cur_ver] = true;
            } else if ('jump' in cur_poly[cur_ver]) {
                used[cur_poly[cur_ver]['jump']] = true;
            }
            res.push(cur_poly[cur_ver].point);
            var next = (cur_ver+1) % cur_poly.length;
            if (cur_poly[next].isInside) {
                cur_ver = next;
            } else if ('jump' in cur_poly[cur_ver]) {
                cur_ver = (cur_poly[cur_ver]['jump'] + 1);
                cur_poly = cur_poly == polygonA ? polygonB : polygonA;
                cur_ver = cur_ver % cur_poly.length;
            } else {
                break;
            }
        } while(!pointsEqual(polygonA[start_ver].point, cur_poly[cur_ver].point));
        return res;
    };


    /**
     * Returns all intersections of two simple polygons
     * @param polygons array which contains
     *        first polygon with inserted intersections and labeled,
     *        second polygon with inserted intersections and labeled,
     *        non-modified first polygon,
     *        non-modified second polygon,
     *        flag indicating if it's a degenerate case
     * @returns all polygons intersections
     */
    function intersectSimplePolygons(polygons) {
        var polygonA = polygons[0],
            polygonB = polygons[1],
            oldPolyA = polygons[2],
            oldPolyB = polygons[3],
            degenerate = polygons[4];
        if (degenerate) {
            // a inside b?
            if (isPolyPointsInside(oldPolyA, oldPolyB)) {
                return [oldPolyA];
            // b inside a?
            } else if (isPolyPointsInside(oldPolyB, oldPolyA)) {
                return [oldPolyB];
            } else {
            // no intersection
                return [];
            }
        }
        polygonA = polygonA.map(function (point) {
            return {
                point: point.point,
                isIntersection: point.isIntersection,
                isInside: isInside(point.point, oldPolyB)
            };
        });
        polygonB = polygonB.map(function (point) {
            return {
                point: point.point,
                isIntersection: point.isIntersection,
                isInside: isInside(point.point, oldPolyA)
            }
        });
        for (var i = 0; i < polygonA.length; i++) {
            if (polygonA[i].isIntersection) {
                for (var j = 0; j < polygonB.length; j++) {
                    if (pointsEqual(polygonA[i].point, polygonB[j].point)) {
                        polygonA[i]['jump'] = j;
                        polygonB[j]['jump'] = i;
                        break;
                    }
                }
            }
        }
        var usedVertices = (new Array(polygonA.length)).map(function (_) {
            return false;
        });
        var res = [];
        while (true) {
            var start_ver = -1;
            for (var i = 0; i < polygonA.length; i++) {
                if (polygonA[i].isIntersection && !usedVertices[i]) {
                    start_ver = i;
                    break;
                }
            }
            if (start_ver == -1) {
                break;
            }
            res.push(traverseIntersection(polygonA, polygonB, start_ver, usedVertices));
        }
        return res;
    };


    /**
     * Returns doubled area of polygon. Doubled so we can get rid of
     * division which may result in errors.
     * @param polygon {Point[]} polygon
     * @returns {Number} returns doubled area of polygon
     */
    function doubledArea(polygon) {
        if (polygon.length <= 2) {
            return 0;
        }
        var res = 0;
        for (var i = 0; i < polygon.length; i++) {
            var point1 = polygon[i];
            var point2 = polygon[(i+1) % polygon.length];
            res += (point1.x - point2.x) * (point1.y + point2.y);
        }
        return Math.abs(res);
    };


    /**
     * Returns all intersections of two non-simple polygons
     * @param polygonA {Point[]} first polygon
     * @param polygonB {Point[]} second polygon}
     * @returns {Point[][]} array of intersections
     */
    function intersects(polygonA, polygonB) {
        var splittedA = split(polygonA);
        var splittedB = split(polygonB);
        var res = [];
        for (var i = 0; i < splittedA.length; i++) {
            for (var j = 0; j < splittedB.length; j++) {
                var intersected = intersectSimplePolygons(
                                    makePolies(splittedA[i], splittedB[j]));
                intersected.forEach(function (intersection) {
                    res.push(intersection);
                });
            }
        }
        var AREA_THRESHOLD = 0.0001;
        return res.filter(function (polygon) {
            return doubledArea(polygon) >= 2 * AREA_THRESHOLD;
        });
    };

    return intersects;
})();

// because of ambiguity in requirements
var intersect = intersects;