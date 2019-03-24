// Libraries.
load('api_config.js');
load('api_gpio.js');
load('api_timer.js');
load('api_pwm.js');
load('api_mqtt.js');
// Modules.
load('board.js');
load('sensors.js');
load('neopixel.js');
load('mqtt.js');


// Initialize all led stored config.
initBoard();
// Neopixel Network search.
netSearch();
// Connect to the mqtt topic.
connectMqtt();