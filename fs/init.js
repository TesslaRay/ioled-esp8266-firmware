load('api_config.js');
load('api_gpio.js');
load('api_timer.js');
load('api_pwm.js');
load('api_rpc.js');
load('api_mqtt.js');
load('board.js');

// Topic to send events.
let eventTopic = '/devices/' + Cfg.get('device.id') + '/events';
// Topic to receive config.
let configTopic = '/devices/' + Cfg.get('device.id') + '/config';
// Topic to send state data. 
let stateTopic = '/devices/' + Cfg.get('device.id') + '/state';

// Initialize all led stored config.
init();

// Set leds to output mode.
//GPIO.set_mode(board.led1.pin, GPIO.MODE_OUTPUT);
GPIO.set_mode(board.led2.pin, GPIO.MODE_OUTPUT);
GPIO.set_mode(board.led3.pin, GPIO.MODE_OUTPUT);
GPIO.set_mode(board.led4.pin, GPIO.MODE_OUTPUT);
GPIO.set_mode(board.led5.pin, GPIO.MODE_OUTPUT);

/* GPIO.set_button_handler(pin, pull, intmode, period, handler)
 * pull: pull type.
 * intmode: interrupt mode.
 * period: debounce interval in milliseconds
 * handler: is a function that receives pin number.
 * Return value: 1 in case of success, 0 otherwise.
*/
GPIO.set_button_handler(board.btn1.pin, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 10, function(button) {
  ledPwmOff(board[board.btn1.ctrl], true);
  print('freq : ', board[board.btn1.ctrl].freq);
  print('duty : ', board[board.btn1.ctrl].duty);
}, null);


/* Subscribe to a MQTT topic and receive config data from IoT Core.
 * @configTopic (str): mqtt topic to subscribe.
 * Callback:
 * @topic (str): mqtt topic.
 * --- IoT Core Formats:
 * --- /devices/{device-id}/events : for telemetry data. Device -> Cloud.
 * --- /devices/{device-id}/config : for config data. Cloud -> Device.
 * @msg (str): config message from the cloud.
 * --- config format:
 * --- {"board": {"led1":{"freq":20, "duty": 0.5, "state": true}, "led2":{"freq":20, "duty": 0.5, "state": true}}}
 */
MQTT.sub(configTopic, function(conn, topic, msg) {
  print('Topic:', topic, 'message:', msg);
  setBoardConfigV2(msg, applyBoardConfig);
});

/* Change the board values via RPC.
 * Dependency must be added - origin: https://github.com/mongoose-os-libs/rpc-uart to send RPC commands via usb.
 * Ex1: mos call board.update '{"led1": { "duty":0.5, "freq":20 }}'
 * Ex2: mos call board.update '{"btn1": { "control": "led1"}}'
 * args is an object. Message from MQTT is a string.
 */
RPC.addHandler('board.update', function(args) {
  return setBoardConfig(args);
});