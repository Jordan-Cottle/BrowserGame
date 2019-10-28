/**
 * Transformation Matrix Construction Library
 */
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
    }else{
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

function rotation(x, y, z, degrees=true){
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
        angle = radians(angle);
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
        angle = radians(angle);
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
        angle = radians(angle);
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