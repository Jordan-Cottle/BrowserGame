class Camera{
    constructor(gl, program, size=2, rotation=0){
        this.gl = gl;
        this.program = program;

        this.x = 0;
        this.y = 0;

        this.size = size;
        this.rotation = rotation;

        this.computeOrthographicProjection();
    }

    loadTransform(name){
        let shaderTransform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix4fv(shaderTransform, false, flatten(this.transform));
    }

    move(x, y){
        this.x += x;
        this.y += y;

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
        let right = this.size / 2;
        let left = -right;
        
        let top = this.size / 2;
        let bottom = -top;

        let near = -1;
        let far = 1;

        let translate = translation(-this.x, -this.y);
        let s = scale(2/(right-left), 2/(top-bottom), -2/(far-near));

        let r = rotateZ(this.rotation);
        this.transform = flatten(compose(s, r, translate));
    }

    render(...objects){
        this.loadTransform('cameraTransform');

        for(let object of objects){
            object.render(this.gl);
        }
    }
}