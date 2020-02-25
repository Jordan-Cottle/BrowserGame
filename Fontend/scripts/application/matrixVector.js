/**
 * Transformation Matrix Construction Library
 */
function vec2(){
    let results = [0, 1];
    let source= flattenArgs(arguments);

    let length = Math.min(source.length, results.length);
    for (let i = 0 ; i < length; i++){
        results[i] = source[i];
    }

    return results;
}
function vec3(){
    let results = [0, 0, 1];
    let source= flattenArgs(arguments);

    let length = Math.min(source.length, results.length);
    for (let i = 0 ; i < length; i++){
        results[i] = source[i];
    }

    return results;
}
function vec4(){
    let results = [0, 0, 0, 1];
    let source= flattenArgs(arguments);

    let length = Math.min(source.length, results.length);
    for (let i = 0 ; i < length; i++){
        results[i] = source[i];
    }

    return results;
}

function transpose(matrix){
    let result = [];

    for(let i = 0; i < matrix.length; i++){
        result.push([]);
        for(let j = 0; j < matrix[i].length; j++){
            result[i].push(matrix[j][i]);
        }
    }

    result.matrix = true;

    return result;
}

function flatten(vector)
{
    if (vector.matrix) {
        vector = transpose(vector);
    }

    if (Array.isArray(vector[0])) {
        var floats = new Float32Array(vector.length*vector[0].length);
        var index = 0;
        for (var i = 0; i < vector.length; ++i) {
            for (  j = 0; j < vector[i].length; ++j) {
                floats[index++] = vector[i][j];
            }
        }
        return floats;
    }
    else {
        return new Float32Array(vector);
    }
}

function identity(size){
    let matrix = [];
    for(let i = 0; i < size; i++){
        let row = [];
        for(let j = 0; j < size; j++){
            if (i === j){
                row.push(1);
            }else{
                row.push(0);
            }
        }

        matrix.push(row);
    }

    matrix.matrix = true;

    return matrix;
}

function magnitude(vector){
    let total = 0;
    for(let i =0; i<vector.length; i++){
        total += vector[i] * vector[i];
    }

    return Math.sqrt(total);
}

function toRadians(angle){
    return angle * Math.PI / 180;
}

function toDegrees(rads){
    return rads * 180 / Math.PI;
}

function normalize(vector){
    let mag = magnitude(vector);

    let res = []
    for(let i = 0; i < vector.length; i++){
        if(mag === 0){
            res[i] = 0
        }else{
            res[i] = vector[i] / mag;
        }
    }

    return res;
}

function negate(vector){
    let result = [];
    for (num of vector){
        result.push(-num);
    }

    return result;
}

function vectorBetween(a, b){
    let vec = [];
    for(let i = 0; i < a.length; i++){
        vec[i] = b[i] - a[i];
    }

    return vec;
}

function crossProduct(a, b){
    return vec3(
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    )
}

function dotProduct(a, b){
    let result = 0;
    for(let i = 0; i < a.length; i++){
        result += a[i] * b[i];
    }

    return result;
}

 // Helper to multiply matrix and vector
function multiply(matrix, matVec){
    let vector = true;
    if (matVec.matrix){
        vector = false;
    }

    if (vector){
        if (matrix.length != matVec.length){
            console.log("Matrix size: " + matrix.length);
            console.log(matrix);
            console.log("Vector size: " + matVec.length);
            console.log(matVec);
            throw "Matrix and vector must be the same size to multiply!";
        }
    
        let result = []
        for(let i = 0; i < matrix.length; i++){
            let sum = 0;
            for(let j = 0; j < matrix.length; j++){
                sum += matrix[i][j] * matVec[j];
            }
            result.push(sum);
        }
    
        return result;
    }
    
    let result = [];
    for(let r = 0; r < matrix.length; r++){
        let row = [];
        for(let c = 0; c < matVec.length; c++){
            let sum = 0;
            for(let i = 0; i < matrix.length; i++){
                sum += matrix[r][i] * matVec[i][c];
            }
            row.push(sum)
        }
        result.push(row);
    }

    result.matrix = true;

    return result;
}

function translation(x, y, z=0){
    let matrix = identity(4);

    if(x.length){
        z = x[2];
        y = x[1];
        x = x[0];
    }

    matrix[0][3] = x;
    matrix[1][3] = y;
    matrix[2][3] = z;

    return matrix;
}

function rotation(x, y=0, z=0, degrees=true){
    if(x.length){
        z = x[2];
        y = x[1];
        x = x[0];
    }
    let Mx = rotateX(x, degrees);
    let My = rotateY(y, degrees);
    let Mz = rotateZ(z, degrees);

    return compose(Mx, My, Mz);
}

function rotateZ(angle, degrees = true){
    if(degrees){
        angle = toRadians(angle);
    }

    let matrix = identity(4);

    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    matrix[0][0] = cos;
    matrix[0][1] = -sin;

    matrix[1][0] = sin;
    matrix[1][1] = cos;

    return matrix;
}

function rotateX(angle, degrees = true){
    if(degrees){
        angle = toRadians(angle);
    }

    let matrix = identity(4);

    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    matrix[1][1] = cos;
    matrix[1][2] = -sin;

    matrix[2][1] = sin;
    matrix[2][2] = cos;

    return matrix;
}

function rotateY(angle, degrees = true){
    if(degrees){
        angle = toRadians(angle);
    }

    let matrix = identity(4);

    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    matrix[0][0] = cos;
    matrix[2][0] = -sin;

    matrix[0][2] = sin;
    matrix[2][2] = cos;

    return matrix;
}

function scale(x, y, z=0){
    let mat = identity(4);

    if(x.length){
        z = x[2];
        y = x[1];
        x = x[0];
    }

    mat[0][0] = x;
    mat[1][1] = y;
    mat[2][2] = z;

    return mat;
}

function compose(...matrices){
    let result = identity(4);

    for(let i = 0; i < matrices.length; i++){
        if(!matrices[i].matrix){
            console.log(matrices[i]);
            throw "Can only compose matrices!";
        }
        result = multiply(matrices[i], result);
    }

    return result;
}

function relativeTo(point, transform){
    return compose(translation(negate(point)), transform, translation(point));
}

function sphericalToCartesian(r, theta, phi, degrees=true){
    if(degrees){
        phi = toRadians(phi);
        theta = toRadians(theta);
    }
    let x = r * Math.cos(theta) * Math.sin(phi);
    let y = r * Math.sin(theta) * Math.sin(phi);
    let z = r * Math.cos(phi);

    return vec3(x, y, z);
}

function cartesianToSpherical(x, y, z){
    let r = magnitude(vec3(x, y, z));
    let phi = Math.acos(z/r);
    let theta = Math.atan2(y,x);

    return vec3(r, toDegrees(theta), toDegrees(phi));
}

function flattenArgs(args){
    if(args.length && args[0].length){
        return args[0];
    }else{
        return args;
    }
}