function randomColor(){
    return vec4(
        Math.random(),
        Math.random(),
        Math.random(),
        1.0
    );
}

function createColors(num){
    let colors = [];

    // create random color for each vertex
    for(let i = 0; i < num; i++){
        colors.push(createRandomColor());
    }

    return colors;
}

function distance(a, b){
    let total = 0;
    for(let  i = 0; i < a.length; i++){
        total += Math.pow(a[i] - b[i], 2);
    }

    return Math.pow(total, .5);
}

function mouseCoords(event){
    results = [0, 0]
    let canvas = document.getElementById("gl-canvas");

    let rect = canvas.getBoundingClientRect();

    results[0] = event.clientX - rect.left;
    results[1] = event.clientY - (rect.top);

    return results;
}