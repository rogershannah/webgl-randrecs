"use strict";

//TODO: move thing out of main bc that's gross
function main() {
    //get a webgl context
    ///** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if(!gl) {
        return;
    }

    //setup glsl program
    var program = webglUtils.createProgramFromScriptes(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    //look up where the vertex data  needs to go
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    //look up uniform location
    var resolutionUniforLocal = gl.getUniformLocation(program, "u_resolution");
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");

    //create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();
    //bind it Array_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    webglUtils.resizeCanvasToDispalySize(gl.canvas);

    //tell webgl how to convert from clip space to pixels
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height);

    //clear the canvas
    gl.clearColor(0,0,0,0); //white
    gl.clear(gl.COLOR_BUFFER_BIT);

    //tell it to use our program(ie the pair of shaders)
    gl.useProgram(program);

    //Yurn on the attribute
    gl.eneableVertexAttribArray(positionAttributeLocation);
    //bind the pos buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //tell the attribute how to get data out of positionBunnfer (ARRAY_BUFFER)
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;

    gl.vertextArrtibPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    //set the resolution
    gl.uniform2f(resolutionUniforLocal, gl.canvas.width, gl.canvas.height);

    //draw 50 random rectangles in random colors
    for (var ii = 0; ii < 50; ++ii) {
        //setup rand rect
        //this will write to positionBuffer 
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300));
        
    //set random color
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    //Draw the rectangle
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset,count);
    }

}


//helpers
// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

  // Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

main();