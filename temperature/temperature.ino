/*
 * File:    readTemperature.ino
 * Author:  Andy Gelme (@geekscape) & Angus Gratton (angus at freetronics. com)
 * License: GPLv3
 *
 * For more information see www.freetronics.com/irtemp
 *
 */

#include "IRTemp.h"

static const byte PIN_DATA    = 2; // Choose any pins you like for these
static const byte PIN_CLOCK   = 3;
static const byte PIN_ACQUIRE = 4;

static const TempUnit SCALE=CELSIUS;  // Options are CELSIUS, FAHRENHEIT

IRTemp irTemp(PIN_ACQUIRE, PIN_CLOCK, PIN_DATA);

void setup(void) {
  Serial.begin(9600);
}

void loop(void) {
  float irTemperature = irTemp.getIRTemperature(SCALE);
  float ambientTemperature = irTemp.getAmbientTemperature(SCALE);
  

  Serial.print(irTemperature);
  Serial.print(",");
  Serial.println(ambientTemperature);

  delay(1000);
}
