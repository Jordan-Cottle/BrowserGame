/**
 * Generates vertices for regular hexagon centered at the origin with a given side length
 * 
 * @param {number} size The length of one of the hexagon's sides 
 * 
 * @returns An array of 6 coordinate pairs containing data for the six vertices of a hexagon
 */
function hexagon(size){
    vertices = [];

    for (let i = 0; i < 6; i++){
        let angle = (60*i) * (Math.PI/180);
        
        vertices.push([
            size*Math.cos(angle),
            size*Math.sin(angle)
        ])
    }

    console.log(vertices);
    return vertices;
}