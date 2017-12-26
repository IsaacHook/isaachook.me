+++
title = "Wifi Salt Lamp (Part 1)"
date = "2017-01-30T18:16:26+11:00"
toc = true
weight = 5

+++

![wifi salt lamp working](/images/salt-lamp-working.gif "wifi salt lamp working")

The end goal of this project is to get a working wifi powerboard.  As a stepping stone I have started with one power point and am using a salt lamp to test.
This post is a write up of what I have done so far, what I learnt, information I used from datasheets and challenges etc...


#### Top Level-ish Schematic
The schematic below shows how all the components fits together.  

The setup is pretty simple, there are basically three parts. The voltage shifter which takes 5V
to 3.3V to keep the ESP8266 happy.  There is the ESP8266 setup itself with the arduino's only purpose being to flash the device with the program.  And there is 
the relay which turns on/off the mains power (controlled by the ESP8266).

![wifi salt lamp schematic](/images/salt-lamp-schematic.jpg "wifi salt lamp schematic")

And here is a picture of the actual setup.  The only difference between this and the schematic is that I used a plug instead of a salt lamp directly.
  Just so that it could be used with other devices.  And also to insulate the relay, to like prevent death and that.

{{< figure src="/images/salt-lamp-part1-setup.jpg" class="earlybird">}}

Mainly for my future reference, here is a list of components used:

Component | Description
--- | --- 
ESP8266 esp-01 | Wifi module to control the relay
[Relay 250VAC 10A](http://www.ebay.com.au/sch/i.html?_odkw=5V+One+1+Channel+Relay+10A&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.X5V+One+1+Channel+Relay+10A+optocoupler.TRS0&_nkw=5V+One+1+Channel+Relay+10A+optocoupler&_sacat=0) | Control mains power
Arduino Uno | To flash ESP8266.  Could have used UART serial adapter
[Switching Power Supply](https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&CatId=&SearchText=+DC+Power+Supply+QJE+PS3005S) | Supply 5V and up to 0.5A
[Op Amp: UA741CP](https://www.google.com.au/search?sourceid=chrome-psyapi2&rlz=1C5CHFA_enAU504AU504&ion=1&espv=2&ie=UTF-8&q=ua741cp%20op%20amp&oq=ua741cp%20op%20amp) | General purpose op amp for voltage shifting circuitry
[BJT: TIP141C](https://www.fairchildsemi.com/datasheets/TI/TIP41C.pdf) | Medium power BJT for supplying 3.3V, needs to be able to handle <= 1A
[BJT: BC548B](http://www.philohome.com/sensors/gp2d12/gp2d12-datasheets/bc548.pdf) | Low power BJT for switching relay on/off.

The sections below describe the process of building each section of the circuit and (hopefully) all the questions I had when making it.

#### Voltage Shifter 5V to 3.3V
The ESP8266 uses 3.3V and the Relay uses 5V therefore voltage shifting circuitry was needed.  There are a lot of people on the internet
saying that they were able to use the module with 5V, but for reliability I choose to follow the specs.

![voltage shifter](/images/salt-lamp-schematic-shifter.jpg "voltage shifter")

The requirements were:

- 5V input
- 3.3V output
- Variable load impedance

! example

#### ESP8266
The ESP8266 was setup and flashed using the arduino as described in previous posts ("hello world..." and "uploading arduino ide...") with a few additions.

![esp8266](/images/salt-lamp-schematic-esp8266.jpg "esp8266")

##### Reset Button
The reset button was hooked up to a pull up resistor and button.  If you've heard the term pull up resistor numerous times before but never
sat down to understand what it means / why we need one / how to decide on the value, then there is a [great post here](https://learn.sparkfun.com/tutorials/pull-up-resistors).

The most common time you use a pullup resitor is when you use a button.  This is because when you use a button you want your input pin to
read high when the button is not pressed and low when it is pressed (assuming pullup).  Therefore we need the resistor for the low state
when the pin is pulled to ground (without it VCC would be grounded).  A picture might make that explanation more clear.

![pullup resistor](/images/pullupresistor.jpg "pullup resistor")

The value of the resistor is chosen with 3 competing objectives in mind:

- Want a low amount of current to be used when button is pushed low (large resistor)
- When high, want to ensure that the voltage divider with input pin allows pin to be held high (small resistor)
- Want to make sure switching speed is not impacted (small resistor)

In our case 1K is an okay choice because:

- Current on button press would be small: 5V / 1K = 5mA
- On button up, voltage divider would give input pin 3.25V: 3.3 (66/67) = 3.25V ([apparently](http://www.esp8266.com/viewtopic.php?f=13&t=9006&start=4) input impedance can be calculated from the 
input leakage current on the [data sheet](http://download.arduino.org/products/UNOWIFI/0A-ESP8266-Datasheet-EN-v4.3.pdf) R = 3.3 / 50n = 66K).  To be checked experimentally, 
couldn't find this info elsewhere in the data sheets.
- Don't really care about switching speed (DC)

##### Decoupling Cap

It took me quite a while to figure out I needed this guy.  After a lot of trial and error I worked out, that even if the salt lamp
was not connected to the breadboard (e.g just plugged into the mains), if I switched the salt lamp on it would reset the ESP8266 module!

The video below shows me successfully changing the state of the GPIO pin initially (led pin text changes between on and off).
I then switch the lamp on (which is not connected to the circuit in any way).  When I go back to the web UI to change the state of the pin,
the ESP8266 has lost connection (does not change).

<video style="display:block; margin: 0 auto;" controls loop>
  <source src="/images/salt-lamp_decoupling_cap.mp4" type="video/mp4" width="600px">
Your browser does not support the video tag.
</video>

That is, even with the insulated power cables there was still enough noise to interupt the ESP's power.  Once I placed a decoupling cap (1uF)
next to the module's power supply it started operating normally again.  This is actually what Espressif recommends you do anyway: ["What factors must I consider when designing a robust power supply for the ESP8266?"](https://espressif.com/en/products/hardware/esp8266ex/overview).

#### Relay & enclosure
As the end goal of this project is to make a wifi powerboard the relay used would need to have specs to handle [Australian mains 
electricity](https://en.wikipedia.org/wiki/AS/NZS_3112), 240V and 10A.  [Any relay on ebay](http://www.ebay.com.au/sch/i.html?_odkw=5V+One+1+Channel+Relay+10A&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.X5V+One+1+Channel+Relay+10A+optocoupler.TRS0&_nkw=5V+One+1+Channel+Relay+10A+optocoupler&_sacat=0)
that meets these specs should be fine.

The schematic below shows how everything was wired up.  The BJT was used to isolate the GPIO pin from the ESP8266 from the input to the relay.

![relay](/images/salt-lamp-relay.jpg)

Pictured below is the relay I used along with a simplified schematic of how it is working.  Basically the low voltage controller inputs
are isolated from the high voltage mains.  Setup VCC and GND and then use active low IN1 to turn the switch on and off.  The ports NO and NC
stand for normally open and normally closed respectively with COM being the common port.  When IN1 is active the NO and COM are connected
otherwise NC and COM are connected.  The schematic is overly simplified because the relay is actually [optocoupled](https://en.wikipedia.org/wiki/Opto-isolator) as well, meaning a photodiode
turns on the magnetic coil.

![relay and simplified schematic](/images/salt-lamp_relay_and_schematic.gif)

To prevent accidentally touching the relay live I chucked it in a PVC pipe and connected a plug to it.  Wiring it up should hopefully be obvious.

![relay insulated](/images/salt-lamp-relay_insulated.jpg)



#### Still To Do:

- Update web control
    - be able to control on/off speed
    - be able to access from the internet
    - add selector to connect to wifi network
    - add option to disconnect from current network
- Work out how to get the wifi module to load with program already flashed (have to re-program each time at the moment)
- 240V to 5V converter
- Replace voltage divider in voltage shifter with zener diode
- Add current sensing module
- Add voltage divider to receiver
- Current limiting BJT


