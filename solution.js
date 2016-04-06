function Vector(x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.negative = function() {
    return new Vector(-this.x, -this.y);
};

Vector.prototype.scalarProduct = function(vector) {
    return this.x * vector.x + this.y * vector.y;
};

Vector.prototype.crossProduct = function(vector) {
    return this.x * vector.y - vector.x * this.y;
};

Vector.prototype.multiply = function(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
};

Vector.prototype.add = function(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
};

function pointsEqual(pointA, pointB) {
    return pointA.x == pointB.x && pointA.y == pointB.y;
}

function indexOf(arr, item, cb) {
    for (var i = 0; i < arr.length; i++) {
        if (cb(arr[i], item)) {
            return i;
        }
    }
    return -1;
}

function isClockwise(polygon) {
    var sum = 0;
    for (var i = 0; i < polygon.length; i++) {
        var current_vertex = polygon[i];
        var next_vertex = polygon[(i+1) % polygon.length];
        sum += (next_vertex.x - current_vertex.x) *
               (next_vertex.y + current_vertex.y);
    }
    return sum > 0;
}

function isOnEdge(point, edge) {
    var edgeVector = new Vector(edge[1].x-edge[0].x, edge[1].y-edge[0].y);
    var pointVector = new Vector(point.x-edge[0].x, point.y-edge[0].y);
    return (edgeVector.crossProduct(pointVector) == 0) &&
           (edgeVector.scalarProduct(pointVector) <=
                edgeVector.scalarProduct(edgeVector));
}

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
}

function isPolyPointsInside(polygonA, polygonB) {
    for (var i = 0; i < polygonA.length; i++) {
        for (var j = 0; j < polygonB.length; j++) {
            if (!isInside(polygonA[i], polygonB)) {
                return false;
            }
        }
    }
    return true;
}

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

function getKey(vertex) {
    return JSON.stringify(vertex);
}

function getVertices(polygon) {
    var vertices = [];
    for (var i = 0; i < polygon.length; i++) {
        vertices.push([polygon[i], polygon[(i+1) % polygon.length]]);
    }
    return vertices;
};

function traverse(start_vertex, vertices) {
    var polygon = [start_vertex];
    var current_vertex = vertices[getKey(start_vertex)].pop();
    while (!pointsEqual(current_vertex, start_vertex)) {
        polygon.push(current_vertex);
        current_vertex = vertices[getKey(current_vertex)].pop();
    }
    return polygon;
}


function _split(polygon) {
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
}

function split(polygon) {
    var vertices = getVertices(polygon);
    var intersection_pts = new Array(vertices.length);
    for (var i = 0; i < intersection_pts.length; i++) {
        intersection_pts[i] = [];
    }
    for (var i = 0; i < vertices.length; i++) {
        for (var j = 0; j < vertices.length; j++) {
            if (i == j ||
                pointsEqual(vertices[i][0], vertices[j][0]) ||
                pointsEqual(vertices[i][0], vertices[j][1]) ||
                pointsEqual(vertices[i][1], vertices[j][0]) ||
                pointsEqual(vertices[i][1], vertices[j][1])) {
                continue;
            }
            var intersection = segmentIntersection(vertices[i], vertices[j]);
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
            var VectorA = new Vector(pointA.x - vertices[i][0].x,
                                 pointA.y - vertices[i][0].y);
            var VectorB = new Vector(pointB.x - vertices[i][0].x,
                                 pointB.y - vertices[i][0].y);
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
    var result = [];
    for (var i = 0; i < vertices.length; i++) {
        if (intersection_pts[i].length == 0) {
            result.push(vertices[i]);
        } else {
            for (var j = 0; j < intersection_pts[i].length; j++) {
                if (j == 0) {
                    result.push([vertices[i][0], intersection_pts[i][0]]);
                }
                if (j == intersection_pts[i].length - 1) {
                    result.push([intersection_pts[i][j], vertices[i][1]]);
                } else {
                    result.push([intersection_pts[i][j], intersection_pts[i][j+1]]);
                }
            }
        }
    }
    return _split(result);
};

function makePolies(polygonA, polygonB) {
    if (!isClockwise(polygonA)) {
        polygonA = polygonA.reverse();
    }
    if (!isClockwise(polygonB)) {
        polygonB = polygonB.reverse();
    }
    var newPolyA = [], newPolyB = [];
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
                console.log(degenerate);
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
    // forming newPolyA
    for (var i = 0; i < intersectionA.length; i++) {
        newPolyA.push({point: polygonA[i],
                       isIntersection: vertexAsIntersectionsA[i]});
        if (intersectionA[i].length > 0) {
            intersectionA[i].sort(function(pointA_, pointB_) {
                var pointA = pointA_.point;
                var pointB = pointB_.point;
                var VectorA = new Vector(pointA.x - polygonA[i].x,
                                     pointA.y - polygonA[i].y);
                var VectorB = new Vector(pointB.x - polygonA[i].x,
                                     pointB.y - polygonA[i].y);
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
            for (var j = 0; j < intersectionA[i].length; j++) {
                if (!pointsEqual(intersectionA[i][j].point, newPolyA[newPolyA.length-1].point)) {
                    newPolyA.push(intersectionA[i][j]);
                }
            }
        }
    }
    // forming newPolyB
    for (var i = 0; i < intersectionB.length; i++) {
        newPolyB.push({point: polygonB[i],
                       isIntersection: vertexAsIntersectionsB[i]});
        if (intersectionB[i].length > 0) {
            intersectionB[i].sort(function(pointA_, pointB_) {
                var pointA = pointA_.point;
                var pointB = pointB_.point;
                var VectorA = new Vector(pointA.x - polygonB[i].x,
                                     pointA.y - polygonB[i].y);
                var VectorB = new Vector(pointB.x - polygonB[i].x,
                                     pointB.y - polygonB[i].y);
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
            for (var j = 0; j < intersectionB[i].length; j++) {
                if (!pointsEqual(intersectionB[i][j].point, newPolyB[newPolyB.length-1].point)) {
                    newPolyB.push(intersectionB[i][j]);
                }
            }
        }
    }
    return [newPolyA, newPolyB, polygonA, polygonB, degenerate];
}

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
}

function intersectSimplePolygons(polygons) {
    var polygonA = polygons[0],
        polygonB = polygons[1],
        oldPolyA = polygons[2],
        oldPolyB = polygons[3],
        degenerate = polygons[4];
    if (degenerate) {
        // a inside b?
        if (isPolyPointsInside(oldPolyA, oldPolyB)) {
            return oldPolyA;
        // b inside a?
        } else if (isPolyPointsInside(oldPolyB, oldPolyA)) {
            return oldPolyB;
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
    var intersection_count = polygonA.reduce(function (prev_val, cur_val) {
        if (cur_val.isIntersection) {
            return prev_val + 1;
        } else {
            return prev_val;
        }
    }, 0);
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
}

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
    return res;
}

// var polygon = [{x:-1, y:1}, {x:1, y:1}, {x:-1, y:-1}, {x:1, y:-1}];
// var polygon = [
//     { x: 30,  y: 240 },
//     { x: 330, y: 240 },
//     { x: 330, y: 210 },
//     { x: 270, y: 90  },
//     { x: 210, y: 270 },
//     { x: 210, y: 90  },
//     { x: 180, y: 60  },
//     { x: 150, y: 90  },
//     { x: 150, y: 270 },
//     { x: 90,  y: 90  },
//     { x: 30,  y: 210 }
//   ];
// console.log(split(polygon));
// var polyA = [
//     { x: 60,  y: 60  },
//     { x: 180, y: 0   },
//     { x: 300, y: 60  },
//     { x: 300, y: 300 },
//     { x: 240, y: 180 },
//     { x: 210, y: 180 },
//     { x: 180, y: 240 },
//     { x: 150, y: 180 },
//     { x: 120, y: 180 },
//     { x: 60,  y: 300 },
//   ];
// var polyB = [
//     { x: 30,  y: 240 },
//     { x: 330, y: 240 },
//     { x: 330, y: 210 },
//     { x: 270, y: 90  },
//     { x: 210, y: 270 },
//     { x: 210, y: 90  },
//     { x: 180, y: 60  },
//     { x: 150, y: 90  },
//     { x: 150, y: 270 },
//     { x: 90,  y: 90  },
//     { x: 30,  y: 210 }
//   ];
// // var polyB = [
// //     {x:0, y:15},
// //     {x:5, y:10},
// //     {x:10, y:15}
// //   ];
// // console.log(makePolies(polyA, polyB));
// // console.log(intersectSimplePolygons(makePolies(polyA, polyB)));
// console.log('INTERSECTION');
// console.log(intersects(polyA, polyB));
