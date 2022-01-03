
main();

'use strict';


function main() {
	//get a webgl context
	///** @type {HTMLCanvasElement} */
	var canvas = document.querySelector('#canvas');
	var gl = canvas.getContext('webgl');
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');

		return;
	}

	//shader programs

	const vertexShaderSourde = `
    attribute vec2 a_postition;
    uniform vec2 u_resolution

    void main() {
        vec2 zeroToOne = a_postition / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTweo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
    }
    `;

	const fragmentShaderSourde = `
    precision mediump float;
        uniform vec4 u_color;

        void main() {
            gl_FragColor = u_color;
        }
    `;

	// //setup glsl program
	// var program = webglUtils.createProgramFromScriptes(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

	const shaderProgram = initShaderProgram(gl, vertexShaderSourde, fragmentShaderSourde);

	// //look up where the vertex data  needs to go
	// var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
	// //look up uniform location
	// var resolutionUniforLocal = gl.getUniformLocation(program, 'u_resolution');
	// var colorUniformLocation = gl.getUniformLocation(program, 'u_color');

	// Collect all the info needed to use the shader program.
	// Look up which attribute our shader program is using
	// for aVertexPosition and look up uniform locations.
	const programInfo = {
		program: program,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(program, 'a_position')
		},
		uniformLocations: {
			resolutionUniforLocal: gl.getUniformLocation(program, 'u_resolution'),
			colorUniformLocation: gl.getUniformLocation(program, 'u_color')
		}
	};

	//moved into initBuffers-------------------------------------------
	const buffers = initBuffers(gl);

	// Draw the scene ------------------------------------------------
	drawScene(gl, programInfo, buffers);
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
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([ x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2 ]),
		gl.STATIC_DRAW
	);
}


//helpers

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl) {
	//create a buffer to put three 2d clip space points in
	var positionBuffer = gl.createBuffer();
	//bind it Array_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	return {
		position: positionBuffer
	};
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers) {
	webglUtils.resizeCanvasToDispalySize(gl.canvas);

	//tell webgl how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	//clear the canvas
	gl.clearColor(0, 0, 0, 0); //white
	gl.clear(gl.COLOR_BUFFER_BIT);

	//tell it to use our program(ie the pair of shaders)
	gl.useProgram(program);

	//Yurn on the attribute
	gl.eneableVertexAttribArray(programInfo.attribLocations.positionAttributeLocation);
	//bind the pos buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

	//tell the attribute how to get data out of positionBunnfer (ARRAY_BUFFER)
	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;

	gl.vertextArrtibPointer(programInfo.attribLocations.positionAttributeLocation, size, type, normalize, stride, offset);

	//set the resolution
	gl.uniform2f(programInfo.uniformLocations.resolutionUniforLocal, gl.canvas.width, gl.canvas.height);

	//m 50 random rectangles in random colors
	for (var ii = 0; ii < 50; ++ii) {
		//setup rand rect
		//this will write to positionBuffer
		setRectangle(gl, randomInt(300), randomInt(300), randomInt(300));

		//set random color
		gl.uniform4f(programInfo.uniformLocations.colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
		//Draw the rectangle
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 6;
		gl.drawArrays(primitiveType, offset, count);
	}
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object

	gl.shaderSource(shader, source);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}
