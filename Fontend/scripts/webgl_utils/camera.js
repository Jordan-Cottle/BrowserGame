class Camera{
    constructor(gl, program, size=2, rotation=0){
        this.gl = gl;
        this.program = program;

        this.pos = vec4(0, 0);

        this.size = size;
        this.rotation = rotation;

        this.computeOrthographicProjection();
    }

    loadTransform(name){
        let shaderTransform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix4fv(shaderTransform, false, flatten(this.transform));
    }

    move(x, y){
        const offset = multiply(rotateZ(-this.rotation), vec4(x, y, 0, 0));
        this.pos[0] += offset[0];
        this.pos[1] += offset[1];

        this.computeOrthographicProjection();
    }

    rotate(angle){
        this.rotation += angle;

        this.computeOrthographicProjection();
    }

    zoom(amount){
        this.size -= amount;

        this.computeOrthographicProjection();
    }

    computeOrthographicProjection(){
        const right = this.size / 2;
        const left = -right;
        
        const top = this.size / 2;
        const bottom = -top;

        const near = -10;
        const far = 10;
        const offset = negate(this.pos);
        const translate = translation(offset[0], offset[1]);
        const s = scale(2/(right-left), 2/(top-bottom), -2/(far-near));

        const r = relativeTo(this.pos, rotateZ(this.rotation));
        this.transform = flatten(compose(s, r, translate));
    }

    render(...objects){
        this.loadTransform('cameraTransform');

        for(let object of objects){
            object.render(this.gl);
        }
    }
}