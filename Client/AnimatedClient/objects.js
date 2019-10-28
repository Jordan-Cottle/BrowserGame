class RenderableObject{
    constructor(buffer, scale=vec3(1,1,1), position=vec3(), rotation=vec3(), velocity=vec3(), angularVelocity=vec3(), center=vec3()){
        this.buffer = buffer;
        this.center = center;
        this.scale = scale;

        this.position = position;
        this.velocity = velocity;

        this.rotation = rotation;
        this.angularVelocity = angularVelocity;
    }

    render(){
        
        this.position = add(this.position, this.velocity);
        this.rotation = add(this.rotation, this.angularVelocity);

        let scaleTransform = scale(this.scale);
        let rot = rotation(this.rotation);
        let translation = translate(this.position);

        let transform = compose(scaleTransform, rot, translation);
        this.buffer.setTransform(transform, this.buffer.getCenter());

        this.buffer.render();
    }
}