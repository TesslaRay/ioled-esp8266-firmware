/* Object with the board config.
 * Each key (i.e led1, led2, ...) must have the same name
 * with the one declared in the mos.yml file.
 */
let board = {
  btn1 : {
    pin: Cfg.get('board.btn1.pin'),
    ctrl: Cfg.get('board.btn1.control')
  },
  led1 : {
    onhi: Cfg.get('board.led1.active_high'),
    duty: Cfg.get('board.led1.duty'),
    freq: Cfg.get('board.led1.freq'),
    pin: Cfg.get('board.led1.pin'),
    state: Cfg.get('board.led1.state'),
  },
  led2 : {
    onhi: Cfg.get('board.led2.active_high'),
    duty: Cfg.get('board.led2.duty'),
    freq: Cfg.get('board.led2.freq'),
    pin: Cfg.get('board.led2.pin'),
    state: Cfg.get('board.led2.state'),
  },
  led3 : {
    onhi: Cfg.get('board.led3.active_high'),
    duty: Cfg.get('board.led3.duty'),
    freq: Cfg.get('board.led3.freq'),
    pin: Cfg.get('board.led3.pin'),
    state: Cfg.get('board.led3.state'),
  },
  led4 : {
    onhi: Cfg.get('board.led4.active_high'),
    duty: Cfg.get('board.led4.duty'),
    freq: Cfg.get('board.led4.freq'),
    pin: Cfg.get('board.led4.pin'),
    state: Cfg.get('board.led4.state'),
  },
  led5 : {
    onhi: Cfg.get('board.led5.active_high'),
    duty: Cfg.get('board.led5.duty'),
    freq: Cfg.get('board.led5.freq'),
    pin: Cfg.get('board.led5.pin'),
    state: Cfg.get('board.led5.state'),
  },
};

// ----- Led Functions -----
/* Update all led values on board start.
 */
let init = function() {
  applyBoardConfig();
};

/* Change the state of the led between on - off
 * @ledName (string): led name. e.g "led1", "led2"
 */
let ledOnOff = function(ledName) {
  let led = board[ledName];
  led.state = !led.state;
  let level = led.onhi ? led.state : !led.state;
  GPIO.write(led.pin, level);
  print('Led state: ', led.state ? 'on' : 'off');
};

/* Change the state of the led between PWM - off
 * --- PWM.set(pin, freq, duty);
 * --- @freq (num): 0 disables PWM on the pin.
 * --- @duty (num): 0 is always off, 0.5 is a square wave, 1 is always on.
 * @ledName (string): led name.
 * @turn (bool): true to change the actual led state. False just for refresh pwm.
 */
let ledPwmOff = function(ledName, turn) {
  let led = board[ledName];
  led.state = turn ? !led.state : led.state;
  if (led.state) {
    if (led.duty === 0 || led.duty === 1) {
      PWM.set(led.pin, 0, led.duty);
      GPIO.write(led.pin, led.duty ? !led.onhi : led.onhi);
    }
    else {
      PWM.set(led.pin, led.freq, led.duty);
    }
  }
  else {
    PWM.set(led.pin, 0, led.duty);
    // Only disabling the pin doesn't always turn it off. (case: onhi = false), so use GPIO.write.
    GPIO.write(led.pin, !led.onhi);
  }
  print(ledName, 'state:', led.state ? 'blinking' : 'off');
};

/* Update board configuration file.
 * @json (str or obj): string or json object with the configuration to update.
 * --- Str when comes from cloud server.
 * --- Obj if used with RPC.
 * example: update led1 with 0.5 duty and 20 freq:
 * '{"led1": { "duty":0.5, "freq":20 }}'
 */
let setBoardConfig = function(json) {
  let ledName = getFirstKey(typeof(json) === 'string' ? JSON.parse(json) : json);
  if (typeof(board[ledName]) === 'undefined') {
    return ledName + ' doesnt exist.';
  }
  let str = typeof(json) === 'string' ? json : JSON.stringify(json);
  let cfg = '{"board":' + str + '}';
  Cfg.set(JSON.parse(cfg));
  applyConfig(board[ledName], ledName);
  return 'Updated.';
};

/* Update board configuration file.
 * @msg str: string with the configuration to update.
 * @callback: callback function to call after succeed config set.
 * example: update led1 with 0.5 duty and 20 freq.
 * {"board": {"led1":{"freq":20, "duty": 0.5, "state": true}}}
 */
let setBoardConfigV2 = function(msg, callback) {
  let brdObj = typeof(msg) === 'string' ? JSON.parse(msg) : msg;
  Cfg.set(brdObj);
  callback();
};
 
/* Apply the configuration to all leds.
 */
let applyBoardConfig = function() {
  for (let ledName in board) {
    if (ledName.indexOf('led') >= 0) {
      applyLedConfig(ledName);
    }
  }
};

/* Apply a single led configuration
 * @ledName (string): ledname to update.
 */
let applyLedConfig = function(ledName) {
  let led = board[ledName];
  let brd = 'board.'+ ledName + '.';
  led.onhi = Cfg.get(brd + 'active_high');
  led.duty = Cfg.get(brd + 'duty');
  led.freq = Cfg.get(brd + 'freq');
  led.state = Cfg.get(brd + 'state');
  normDuty(ledName);
  print('entrando a PWM')
  ledPwmOff(ledName, false);
};

/* Normalize the value of the duty cycle between 0 - 1
 * @ledName (string): led name to normalize its duty cycle.
 */
let normDuty = function(ledName) {
  let led = board[ledName];
  if (led.duty >= 1) {
    led.duty = led.onhi ? 1.0 : 0.0;
    return;
  }
  if (led.duty <= 0) {
    led.duty = led.onhi ? 0.0 : 1.0;
    return;
  }
  led.duty = led.onhi ? led.duty : 1.0 - led.duty;
};

/* Return the first element of an object.
 * @obj (object): the object. ex: {"led7": { "duty":0.5, "freq":50 }}
 * @return: led7
 */ 
let getFirstKey = function(obj) {
  for (let k in obj)
    return k;
};