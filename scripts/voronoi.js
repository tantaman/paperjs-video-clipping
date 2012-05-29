var prog = continueProg();
window.prog = prog;

function onResize() {
    prog.resize();
}

function onMouseDown(event) {
    prog.mouseDown(event);
}

function onMouseMove(event) {
    prog.mouseMove(event);
}

function onFrame(event) {
    if (video) {
        ctx.drawImage(video, 0, 0);
        prog.render();
        view.draw();
    }
}

function continueProg() {
var voronoi =  new Voronoi();
var sites = generateBeeHivePoints(view.size / 200, true);
var bbox, diagram;
var oldSize = view.size;
var spotColor = new Color('red');
var mousePos = view.center;
var selected = false;

resize();

function renderDiagram() {
    project.activeLayer.children = [];
    var diagram = voronoi.compute(sites, bbox);
    if (diagram) {
        for (var i = 0, l = sites.length; i < l; i++) {
            var cell = diagram.cells[sites[i].voronoiId];
            if (cell) {
                var halfedges = cell.halfedges,
                    length = halfedges.length;
                if (length > 2) {
                    var points = [];
                    for (var j = 0; j < length; j++) {
                        v = halfedges[j].getEndpoint();
                        points.push(new Point(v));
                    }
                    createPath(points, sites[i]);
                }
            }
        }
    }
}

function removeSmallBits(path) {
    var averageLength = path.length / path.segments.length;
    var min = path.length / 50;
    for(var i = path.segments.length - 1; i >= 0; i--) {
        var segment = path.segments[i];
        var cur = segment.point;
        var nextSegment = segment.next;
        var next = nextSegment.point + nextSegment.handleIn;
        if (cur.getDistance(next) < min) {
            segment.remove();
        }
    }
}

function generateBeeHivePoints(size, loose) {
    var points = [];
    var col = view.size / size;
    for(var i = -1; i < size.width + 1; i++) {
        for(var j = -1; j < size.height + 1; j++) {
            var point = new Point(i, j) / new Point(size) * view.size + col / 2;
            if(j % 2)
                point += new Point(col.width / 2, 0);
            if(loose)
                point += (col / 4) * Point.random() - col / 4;
            points.push(point);
        }
    }
    return points;
}
function createPath(points, center) {
    var path = new Path();
    if (!selected) { 
        path.fillColor = spotColor;
    } else {
        path.fullySelected = selected;
    }
    path.closed = true;

    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i];
        var next = points[(i + 1) == points.length ? 0 : i + 1];
        var vector = (next - point) / 2;
        path.add({
            point: point + vector,
            handleIn: -vector,
            handleOut: vector
        });
    }
    path.scale(0.95);
    removeSmallBits(path);

    var raster = new Raster(vidCanvas);
    raster.position = path.position;
    var group = new Group([path, raster]);
    group.clipped = true;
    //group.position = view.center;
    return path;
}

function resize() {
    // vidCanvas.width = view.bounds.width;
    // vidCanvas.height = view.bounds.height;
    console.log(vidCanvas);
    var margin = 20;
    bbox = {
        xl: margin,
        xr: view.bounds.width - margin,
        yt: margin,
        yb: view.bounds.height - margin
    };
    for (var i = 0, l = sites.length; i < l; i++) {
        sites[i] = sites[i] * view.size / oldSize;
    }
    oldSize = view.size;
    renderDiagram();
}

return {
    mouseMove: function(event) {
        mousePos = event.point;
        if (event.count == 0)
            sites.push(event.point);
        sites[sites.length - 1] = event.point;
       // renderDiagram();
    },

    resize: resize,

    mouseDown: function(event) {
        sites.push(event.point);
      //  renderDiagram();
    },

    render: renderDiagram
};
}