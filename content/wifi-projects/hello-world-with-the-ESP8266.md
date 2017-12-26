+++
weight = 2
title = "Hello World with the ESP8266"
date = "2017-01-08T15:12:17+11:00"
toc = true
+++

The [ESP8266](https://espressif.com/en/products/hardware/esp8266ex/overview) 
is an affordable WIFI chip which is the answer to pretty much any question like "how do I give this WIFI?".

The chip comes in a variety of modules named esp-XX.  The most common ones are from AI-Thinkers but Espressif Systems (the maker of the chip) also have their own.
A list of the different modules can be found [here](http://www.esp8266.com/wiki/doku.php?id=esp8266-module-family).

The board in the picture below is the low cost esp-01 module you can buy off [ebay](http://www.ebay.com.au/sch/i.html?_odkw=esp8266&_osacat=92074&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.Xesp8266+esp-01.TRS0&_nkw=esp8266+esp-01&_sacat=92074) for $2 or so, with
the antenna, clock, resistors etc already wired up.

![ESP8266_board](/images/ESP8266_annotation.png?classes=border,shadow&width=60%)

| Pin | Description |
| --- | ----------- |
| VCC | 3.3V |
| GPIO_0 | General purpose input/output 0 |
| GPIO_2 | General purpose input/output 2 |
| CHIP_PD | Chip enable |
| GND | Ground |
| RX | Receive |
| TX | Trasmit |

#### Communicating with the ESP8266
There a bunch of different ways of speaking to the ESP8266 chip according to the [datasheet](https://espressif.com/en/products/hardware/esp8266ex/resources).
Either via SPI, I2C, or UART, which are all just communication protocols.

On the esp-01 module, only the RX (receive) and TX (transmit) pins required for UART communication are available.  UART stands
for universal asynchronous receiver/transmitter, a good explanation of it can be found at [circuit basic](http://www.circuitbasics.com/basics-uart-communication/) along
with explanations of the SPI and I2C protocols.

To connect your ESP8266 module to your computer you can either use a [USB to UART serial adapter](http://www.ebay.com.au/sch/i.html?_odkw=uart&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR1.TRC0.A0.H0.Xusb+to+uart.TRS0&_nkw=usb+to+uart&_sacat=0)
or if you have an Arduino Uno than you can use your Arduino Uno as a serial adapter.

#### Wiring up your module
The schematic below shows how to wire up your module with the Arduino Uno.

<iframe frameborder='0' height='448' marginheight='0' marginwidth='0' scrolling='no' src='https://circuits.io/circuits/3654955-wiring-up-the-esp8266/embed#breadboard' width='650'></iframe>

There are a couple of things I found confusing initially when linking everything up.

**Should RX -> TX or RX -> RX?**  
If you wanted to think about this intuitively you could probably argue either of these equally.  When we are connecting devices together
you actually connect RX -> TX and vice versa.  However in our case we are not really using the Arduino, we are just using it's serial adapter capability.
Therefore we actually wire up RX -> RX and TX -> TX.

**ESP8266 needs to be powered via an external source**  
The Arduino does have a 3.3V output port, however it can only provide up to [50mA of current](https://www.arduino.cc/en/Main/ArduinoBoardUno).
The ESP8266 is super thirsty and needs on average [80mA of current](https://espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf).

**A voltage divider needs to be used on the RX line**  
Arduino is a 5V board and the ESP8266 is a 3.3V board, therefore a voltage divider needs to be used to match the logic levels.
There are also a couple of other options that could be used instead of a voltage divider ([Logic converter](http://www.ebay.com.au/sch/i.html?_from=R40&_trksid=p2050601.m570.l1313.TR10.TRC0.A0.H0.Xiphone+se.TRS0&_nkw=logic+converter+5v+3.3v&_sacat=0), 
Zener diode).

**How come this works without boosting the voltage on the TX line to 5V**  
Arduino defines logic HIGH as a voltage [greater than 3V](https://www.arduino.cc/en/Reference/Constants).
Since we are using 3.3V there is no need to step this up.

#### Sending your first command
Now that the module is all wired up we can start sending it commands.
The chip should come pre-loaded with firmware that allows you to send AT commands.
  AT commands are just an instruction set used for controlling modems.  The full list available 
can be found in [Espressif's documentation](https://espressif.com/sites/default/files/documentation/4a-esp8266_at_instruction_set_en.pdf).

Here are the steps to get it working:  

- Upload the bare minimum sketch to the Arduino to clear any previous programs
- Open the serial monitor and select the options "Both NL & CR" and "115200 baud"
![Serial Monitor](/images/serial_monitor.jpg)
- Type AT, hit send and you should see the response OK
- If not touch the RESET pin on the ESP8266 to ground and try again

<video style="display:block; margin: 0 auto;" controls loop>
    <source src="/images/AT_commands.mp4" type="video/mp4" width="600px">
    Your browser does not support the video tag.
</video>





