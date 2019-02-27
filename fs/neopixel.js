load('api_neopixel.js');
load('api_events.js')


let pin = Cfg.get('board.neopixel.pin');
let numPixels = Cfg.get('board.neopixel.pixels');
let colorOrder = NeoPixel.GRB;
let strip = NeoPixel.create(pin, numPixels, colorOrder);

// True if is connected to GCP.
let online = false;                              
let pixel = 0;

let net_search = Timer.set(500, Timer.REPEAT, function() 
{
  print('net_search');
  pixel = ++pixel% numPixels;
  let r = 200, g = 35, b = 0;
  strip.clear();
  strip.setPixel(pixel, r, g, b);
  strip.show();
}, null);



Event.on(Event.CLOUD_DISCONNECTED, function()
{
  online = false;
}, null);

Event.on(Event.CLOUD_CONNECTED, function() 
{
  online = true;
  Timer.del(net_search);
  let r = 0, g = 255, b = 0;
  strip.clear();
  strip.setPixel(0, r, g, b);
  strip.setPixel(1, r, g, b);
  strip.setPixel(2, r, g, b);
  strip.show();
}, null);

Timer.set(1000, Timer.REPEAT, function() 
{

}, null);