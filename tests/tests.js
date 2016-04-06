;QUnit.test('Rectangle intersection', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x:-5, y:2},
        {x:-5, y:8},
        {x:15, y:8},
        {x:15, y:2}
    ];
    var expected = [[
        {x:0, y:2},
        {x:0, y:8},
        {x:10, y:8},
        {x:10, y:2}
    ]];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('A inside B', function (assert) {
    var polygonA = [
        {x:1, y:1},
        {x:1, y:9},
        {x:9, y:9},
        {x:9, y:1}
    ];
    var polygonB = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var expected = [polygonA];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('B inside A', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x:1, y:1},
        {x:1, y:9},
        {x:9, y:9},
        {x:9, y:1}
    ];
    var expected = [polygonB];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('A equals B', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = polygonA;
    var expected = [polygonA];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('Some of B\'s vertices are same as A\'s', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10}
    ];
    var expected = [polygonB];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('Some of A\'s vertices are same as B\'s', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10}
    ];
    var polygonB = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var expected = [polygonA];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('A\'s vertex lies on B\'s edge', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:2, y:9},
        {x:9, y:2}
    ];
    var polygonB = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var expected = [polygonA];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('B\'s vertex lies on A\'s edge', function (assert) {
    var polygonB = [
        {x:0, y:0},
        {x:2, y:9},
        {x:9, y:2}
    ];
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var expected = [polygonB];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('No intersection, not even points', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:2, y:9},
        {x:9, y:2}
    ];
    var polygonB = [
        {x:10, y:10},
        {x:10, y:110},
        {x:110, y:110},
        {x:110, y:10}
    ];
    var expected = [];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('No intersection, common point', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x:0, y:15},
        {x:5, y:10},
        {x:10, y:15}
    ];
    var expected = [];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
    assert.deepEqual(intersects(polygonB, polygonA), expected);
});


QUnit.test('No intersection, common vertex', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x:0, y:10},
        {x:0, y:15},
        {x:5, y:15}
    ];
    assert.deepEqual(intersects(polygonA, polygonB), []);
    assert.deepEqual(intersects(polygonB, polygonA), []);
});


QUnit.test('No intersection, common edge', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x:0, y:10},
        {x:0, y:20},
        {x:10, y:20},
        {x:10, y:10}
    ];
    assert.deepEqual(intersects(polygonA, polygonB), []);
    assert.deepEqual(intersects(polygonB, polygonA), []);
});

QUnit.test('Common edge, A in B', function(assert) {
    var polygonA = [
        {x: 2, y:0},
        {x: 2, y:10},
        {x: 10, y:10},
        {x: 10, y:0}
    ];
    var polygonB = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    assert.deepEqual(intersects(polygonA, polygonB), [polygonA]);
});


QUnit.test('No intersection, common edge segment', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x:2, y:10},
        {x:2, y:20},
        {x:8, y:20},
        {x:8, y:10}
    ];
    assert.deepEqual(intersects(polygonA, polygonB), []);
    assert.deepEqual(intersects(polygonB, polygonA), []);
});


QUnit.test('Intersection, common edge segment', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:0, y:10},
        {x:10, y:10},
        {x:10, y:0}
    ];
    var polygonB = [
        {x: 1, y: 1},
        {x: 1, y: 9},
        {x: 10, y: 9},
        {x: 10, y: 1}
    ];
    var expected = [[
      {x: 10, y: 9},
      {x: 10, y: 1},
      {x: 1, y: 1},
      {x: 1, y: 9}
    ]];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
    assert.deepEqual(intersects(polygonB, polygonA), expected);
});


QUnit.test('Intersection simple with non-simple', function (assert) {
    var polygonA = [
      { x: 60,  y: 60  },
      { x: 180, y: 0   },
      { x: 300, y: 60  },
      { x: 300, y: 300 },
      { x: 240, y: 180 },
      { x: 210, y: 180 },
      { x: 180, y: 240 },
      { x: 150, y: 180 },
      { x: 120, y: 180 },
      { x: 60,  y: 300 },
    ];
    var polygonB = [
      { x: 30,  y: 240 },
      { x: 330, y: 240 },
      { x: 330, y: 210 },
      { x: 270, y: 90  },
      { x: 210, y: 270 },
      { x: 210, y: 90  },
      { x: 180, y: 60  },
      { x: 150, y: 90  },
      { x: 150, y: 270 },
      { x: 90,  y: 90  },
      { x: 30,  y: 210 }
    ];
    var expected = [[
        {x: 90, y: 240},
        {x: 120, y: 180},
        {x: 90, y: 90},
        {x: 60, y: 150},
        {x: 60, y: 240 }
      ],
      [
        {x: 150, y: 180},
        {x: 180, y: 240},
        {x: 210, y: 180},
        {x: 210, y: 90},
        {x: 180, y: 60},
        {x: 150, y: 90}
      ],
      [
        {x: 240,y: 180},
        {x: 270,y: 240},
        {x: 300,y: 240},
        {x: 300,y: 150},
        {x: 270,y: 90}
      ]
    ]
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('Intersection non-simple with non-simple', function (assert) {
    var polygonA = [
        {x:0, y:0},
        {x:10, y:0},
        {x:10, y:20},
        {x:20, y:20},
        {x:20, y:10},
        {x:0, y:10}
    ];
    var polygonB = [
        {x:2, y:-5},
        {x:2, y:12},
        {x:22, y:12},
        {x:22, y:14},
        {x:4, y:14},
        {x:4, y:-5}
    ];
    var expected = [
      [
        {x: 2, y: 10},
        {x: 4, y: 10},
        {x: 4, y: 0},
        {x: 2, y: 0}
      ],
      [
        {x: 10, y: 12},
        {x: 10, y: 14},
        {x: 20, y: 14},
        {x: 20, y: 12}
      ]
    ];
    assert.deepEqual(intersects(polygonA, polygonB), expected);
});


QUnit.test('Small area', function (assert) {
    var polygonA = [
        {x: 0, y:1},
        {x: 201, y:201},
        {x: 1, y:0}
    ];
    var polygonB = [
        {x: 399, y:400},
        {x:201-.00001, y:201-.00001},
        {x:400, y: 399}
    ];
    assert.deepEqual(intersects(polygonA, polygonB), []);
    assert.deepEqual(intersects(polygonA, polygonB), []);
});