const drawModes = {
    'Point': 1,
    'Line': 2,
    'Triangle': 3,
};

class PrimitiveBuffer{
    constructor(gl, program, type, color=null){
        this.gl = gl;
        this.program = program;
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.transformMatrix = identity(4);
        this.shaderTransform = gl.getUniformLocation(program, "transform");

        if(color === null){
            this.defaultColor = vec4(Math.random(), Math.random(), Math.random(), 1);
        }else{
            this.defaultColor = color;
        }

        // Create vertex buffer and bind to gl
        this.vBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW);

        this.cBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.colors), this.gl.STATIC_DRAW);

        this.iBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        this.changeType(type);
    }

    addVertex(vertex, color=null){
        let i;
        let v = vec4();
        for(i = 0; i < vertex.length; i++){
            v[i] = vertex[i];
        }

        this.vertices.push(v);
        this.updateBuffer(this.vBuffer, this.vertices);

        if(color === null){
            this.colors.push(this.defaultColor);
        }else{
            this.colors.push(color);
        }

        this.updateBuffer(this.cBuffer, this.colors);
    }

    setVertex(index, vertex, color){
        this.vertices[index] = vertex;
        this.updateBuffer(this.vBuffer, this.vertices);

        this.colors[index] = color;
        this.updateBuffer(this.cBuffer, this.colors);
    }

    colorVertex(index, color){
        this.colors[index] = color;
        this.updateBuffer(this.cBuffer, this.colors);
    }

    addIndex(index){
        if(index > this.vertices.length){
            throw "" + index + " is not a valid vertex in this buffer!";
        }

        this.indices.push(index);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
    }

    /**
     * Transforms the vertices in this buffer by the given matrix. Optionally will compute reference point automatically given a point to transform about.
     * Start and end indices can also be specified and the transformation will only apply to vertices in that range.
     * @param {mat4} matrix The transformation matrix to apply to the vertices in this buffer
     * @param {vec3} reference A point to transform the vertices in relation to.
     * @param {int} start The beginning of the range of vertices you wish to transform
     * @param {int} end The last vertex you wish to transform in the range.
     */
    transform(matrix, reference=vec3(0,0,0), start=0, end=null){
        let transform = relativeTo(reference, matrix);

        if(end === null){
            end = this.vertices.length-1;
        }

        for(let i = start; i <= end; i++){
            this.vertices[i] = multiply(transform, this.vertices[i]);
        }

        this.updateBuffer(this.vBuffer, this.vertices);
    }

    setTransform(matrix, reference=vec3(0,0,0)){
        this.transformMatrix = relativeTo(reference, matrix);
    }

    render(){
        if (this.length() == 0){
            console.log("Empty buffer!");
            return;
        }

        // set color attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
        let vColor = this.gl.getAttribLocation(this.program, "vColor");
        this.gl.vertexAttribPointer(vColor, 4,this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vColor);

        // set position attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBuffer);
        let vPosition = this.gl.getAttribLocation(this.program, "vPosition");
        this.gl.vertexAttribPointer(vPosition, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vPosition);

        this.gl.uniformMatrix4fv(this.shaderTransform, false, flatten(this.transformMatrix));

        // Render data in buffers
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        this.gl.drawElements(this.drawMode, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    indexOf(vertex){
        let index = this.vertices.indexOf(vertex);
        if(index == -1){
            return index;
        }

        let mindex = index - index%this.objectSize;
        return mindex / this.objectSize;
    }

    length(){
        return (this.vertices.length / this.objectSize) >> 0;
    }

    size(){
        return this.vertices.length;
    }

    reset(){
        this.vertices = [];
        this.colors = [];

        this.updateBuffer(this.vBuffer, this.vertices);
        this.updateBuffer(this.cBuffer, this.colors);
    }

    findVertexNear(x, y, z=0, maxDistance=10){
        let maxXDelta = (wXMax-wXMin) / displayWidth * maxDistance;
        let maxYDelta = (wYMax-wYMin) / displayHeight * maxDistance;
        let closePoints = []
        for(let i = 0; i < this.vertices.length; i++){
            let point = this.vertices[i];

            // quick square box check
            if (Math.abs(point[0] - x) <= maxXDelta
            && Math.abs(point[1] - y) <= maxYDelta){
                closePoints.push(point)
            }
        }

        // early exit for 0 or 1 point found
        if(!closePoints.length){
            return null;
        }else if(closePoints.length == 1){
            return closePoints[0];
        }

        let click = vec3(x,y,z);
        // slower nearest distance check
        let minDistance = distance(click, closePoints[0]);
        let minPoint = closePoints[0];
        for(let i = 0; i < closePoints.length; i++){
            let point = closePoints[i];
            let dist = distance(point, click);

            if(dist < minDistance){
                minDistance = dist;
                minPoint = point;
            }
        }

        return minPoint;
    }

    updateBuffer(buffer, data){
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW);
    }

    changeType(type){
        switch(type){
            case 'point':
            case 'Point':
            case drawModes.Point:
                this.type = 'Point';
                this.objectSize = 1;
                this.drawMode = gl.POINTS;
                break;
            case 'line':
            case 'Line':
            case drawModes.Line:
                this.type = 'Line';
                this.objectSize = 2;
                this.drawMode = gl.LINES;
                break;
            case 'triangle':
            case 'Triangle':
            case drawModes.Triangle:
                this.type = 'Triangle';
                this.objectSize = 3;
                this.drawMode = gl.TRIANGLES;
                break;
            default:
                console.log(type + " not recognized as a primitive type!");
                this.objectSize = 1;
                this.drawMode = gl.POINTS;
        }
    }

    getCenter(start, end){
        let center = vec3(0, 0, 0);
        
        let count = 0;
        for(let i = start; i <= end; i++){
            
            center = add(center, this.vertices[i]);
            count++;
        }

        for(let i = 0; i < center.length && count!=0; i++){
            center[i] /= count;
        }

        return center;
    }
};