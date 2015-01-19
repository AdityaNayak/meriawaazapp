exports.pointInPolygon = function (point, polygon, name, Vertex) {
    var pov = Vertex;
    var check = false;
    for(var i=0;i<polygon.length;i++) {
        if (point.x == polygon[i].x && point.y==polygon[i].y) {
            check = true;
            break;
        }
    }
      
    if (pov == true && check == true) {
        return true;
    }
    intersections = 0; 
    vertices_count = polygon.length;
  
    for (var i=1; i < vertices_count; i++) {
        var vertex1 = polygon[i-1]; 
        var vertex2 = polygon[i];
        if (vertex1.y == vertex2.y && vertex1.y == point.y && point.x > Math.min(vertex1.x, vertex2.x) && point.x < Math.max(vertex1.x,vertex2.x)) { // Check if point is on an horizontal polygon boundary
            return true;
        }
        if (point.y > Math.min(vertex1.y, vertex2.y) && point.y <= Math.max(vertex1.y, vertex2.y) && point.x <= Math.max(vertex1.x, vertex2.x) && vertex1.y != vertex2.y) { 
            var xinters = (point.y - vertex1.y) * (vertex2.x - vertex1.x) / (vertex2.y - vertex1.y) + vertex1.x; 
            if (xinters == point.x) { 
                  
                return true;
            }
            if (vertex1.x == vertex2.x || point.x <= xinters) {
                intersections++; 
            }
        } 
    } 
    if (intersections % 2 != 0) {
        return true;
    } else {
        return false;
    }
}