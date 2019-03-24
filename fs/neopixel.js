load('api_neopixel.js');
load('api_events.js');

// The pixel index.
let pixel = 0;
// Get the neopixel pin (13)
let pin = Cfg.get('board.neopixel.pin');
// Get the number of pixels (3).
let numPixels = Cfg.get('board.neopixel.pixels');
// Create a and return a neoPixel strip object.
let strip = NeoPixel.create(pin, numPixels, NeoPixel.GRB);

// RGB colors.
let red = {r: 200, g: 0, b: 0};
let green = {r: 0, g: 200, b: 0};
let blue = {r: 0, g: 0, b: 200};

// Numeric timer ID
let timerId;

/**
 * Network search function.
 * @description Pixel blinks on network discover. Stop blinking when connected.
 */
let netSearch = function() {
	// Initialize before using.
	initStrip();
	// Set timer to change pixel every 500 ms.
	timerId = Timer.set(
		500,
		Timer.REPEAT,
		function() {
			pixel = (pixel + 1) % numPixels;
			setOnePixel(pixel, red);
		},
		null
	);

	// Stop the timer on connection.
	Event.addHandler(
		Event.CLOUD_CONNECTED,
		function() {
			print('Connected to cloud');
			Timer.del(timerId);
			setAllPixels(green);
		},
		null
	);
};

/**
 * Initialize the strip.
 */
let initStrip = function() {
	strip.clear();
	strip.setPixel(0, 0, 0, 0);
	strip.setPixel(1, 0, 0, 0);
	strip.setPixel(2, 0, 0, 0);
	strip.show();
};

/**
 *  Paint only one pixel of the strip.
 * @param {number} pixel The pixel index.
 * @param {{r: number, g: number, b: number}} color RGB color object.
 */
let setOnePixel = function(pixel, color) {
	strip.clear();
	for (let i = 0; i < numPixels; i++) {
		pixel === i ? strip.setPixel(i, color.r, color.g, color.b) : strip.setPixel(i, 0, 0, 0);
	}
	strip.show();
};

/**
 * Paint all pixels on the stirp.
 * @param {{r: number, g: number, b: number}} color RGB color object.
 */
let setAllPixels = function(color) {
	strip.clear();
	for (let i = 0; i < numPixels; i++) {
		strip.setPixel(i, color.r, color.g, color.b);
	}
	strip.show();
};
