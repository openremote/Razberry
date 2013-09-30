/*
 * OpenRemote, the Home of the Digital Home.
 * Copyright 2008-2013, OpenRemote Inc.
 *
 * See the contributors.txt file in the distribution for a
 * full listing of individual contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/*
This is a collection of functions for easy interface with OpenRemote
Author: Pieter E. Zanstra

Version 1.00.009      2013-09-27
Updated installation instruction in this file

Version 1.00.008      2013-09-25
Adaptations for RazBerry v1.4 release
- .SetWithDuration has been abandoned so DimmerSet has been changed again.


Version 1.00.007      2013-08-07
- Added a number of SensorMultilevel variants (Humidity, Luminescence)

Version 1.00.006      2013-07-31
- Fixed error with DimmerSet function

Version 1.00.005      2013-07-21
- Fixed error in DimmerLevel
- Now use .SetWithDuration (0) instead of .Set in DimmerSet function
- Added function DimmerStatus (author Velouria)       

INSTALLATION
Copy this file called openremote.js to Raspberry Pi directory: 
/opt/z-way-server/automation.
Open with an editor file config.json in that same directory. Search for the line
that contains:      "customCodeFiles": [ "custom.js" ]
Change that to:     "customCodeFiles": [ "custom.js", "openremote.js" ]

Restart the Z-Way server.

USAGE
General parameters used in the calls are:
N        the number that designates a Z-Wave device
I        the number that refers to an instance (e.g. a channel in a dual binary switch
         Use 0 for single binary switches. For dual switches use 1 and 2 for 
	     channels 1 and 2 respectively)
${param} This variable is an OpenRemote system parameter that is used e.g. for 
         passing values from a slider.
S		 Scale (e.g. Watt, kWh, etc.)

Status functions that return the value "on" or "off" are to be used in OpenRemote with 
sensors of the type:switch. Apply Regular expression: on|off in the http call. 		 
*/

/*SwitchBinaryOn(N,I) 
OpenRemote usage: http://raspberry_IP:8083/JS/Run/SwitchBinaryOn(N,I)
*/
SwitchBinaryOn = function(N,I) {
  zway.devices[N].instances[I].SwitchBinary.Set(255);
  var status = (zway.devices[N].instances[I].SwitchBinary.data.level.value==255) ? "on" : "off";
  return status;  
}

/*SwitchBinaryOff(N,I)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/SwitchBinaryOff(N,I)
*/
SwitchBinaryOff = function(N,I) {
  zway.devices[N].instances[I].SwitchBinary.Set(0);
  return status;
}

/*SwitchBinaryStatus(N,I)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/SwitchBinaryStatus(N,I)
Add Regular Expression on|off in http call specification 
Do use Sensor type:switch with this command
*/
SwitchBinaryStatus = function(N,I) {
  var status = (zway.devices[N].instances[I].SwitchBinary.data.level.value==255) ? "on" : "off";
  return status;
}

/*DimmerSet(N,${param})
OpenRemote usage: http://raspberry_IP:8083/JS/Run/DimmerSet(N,${param})
*/
DimmerSet = function(N,SetLevel) {
  zway.devices[N].instances[0].SwitchMultilevel.Set(SetLevel)
}
/*DimmerLevel(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/DimmerLevel(N)
*/
DimmerLevel = function(N) {
  return zway.devices[N].instances[0].SwitchMultilevel.data.level.value
}

/*DimmerStatus(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/DimmerStatus(N)
Add Regular Expression on|off in http call specification 
Do use Sensor type:switch with this command
*/
DimmerStatus = function(N) {
 var status = (zway.devices[N].instances[0].SwitchMultilevel.data.level.value>0) ? "on" : "off";
  return status;
}

/*AlarmStatus(N)
OpenRemote usage : http://raspberry_IP:8083/JS/Run/AlarmStatus(N)
*/
AlarmStatus = function(N) {
	var status = (zway.devices[N].instances[0].AlarmSensor.data.level.value==0) ? "on" : "off" ;
	return status;
}

/*BinaryStatus(N)
OpenRemote usage : http://raspberry_IP:8083/JS/Run/BinaryStatus(N)
To be used for Door/Window sensors, etc.
*/
BinaryStatus = function(N) {
	var status= (zway.devices[N].instances[0].SensorBinary.data.level.value==0) ? "on" : "off" ;
	return status;
}


/*ThermostatLevel(N) 
OpenRemote usage: http://raspberry_IP:8083/JS/Run/ThermostatLevel(N)
*/
ThermostatLevel = function(N) {
  var modus = zway.devices[N].ThermostatMode.data.mode.value;
  return zway.devices[N].ThermostatSetPoint.data[modus].setVal.value;
}

/*ThermostatSet(N,${param}) 
OpenRemote usage: http://raspberry_IP:8083/JS/Run/ThermostatSet(N,${param})
Function for Eurotronic Stella Z thermostatic valve
*/
ThermostatSet = function(N,SetTemp) {
  var modus = zway.devices[N].ThermostatMode.data.mode.value;
    zway.devices[N].instances[0].ThermostatSetPoint.Set(modus,SetTemp);
}


/*ThermostatSetMode(N,Mode) 
OpenRemote usage: http://raspberry_IP:8083/JS/Run/ThermostatSetMode(N,Mode)
*/
ThermostatSetMode = function(N,Mode) {
  zway.devices[N].instances[0].ThermostatMode.Set(Mode);
}

/*ThermostatModeName(N) 
OpenRemote usage: http://raspberry_IP:8083/JS/Run/ThermostatModeName(N)
Do use RexExp [\w\s]{1,} in the http-call to get rid of quotes
*/
ThermostatModeName = function(N) {
  var modus = zway.devices[N].ThermostatMode.data.mode.value;
  return zway.devices[N].instances[0].ThermostatMode.data[modus].modeName.value
}

 
/*BatteryLevel(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/BatteryLevel(N)
Do use Sensor type:Range with this command for use in slider
*/
BatteryLevel = function(N) {
  zway.devices[N].instances[0].Battery.Get();
  return zway.devices[N].instances[0].Battery.data.last.value;
}

/*MeterElectricLevel(N,I,S)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/MeterElectricLevel(N,I,S)
Use S=0 for kWh; S=2 for Watts;  
*/
MeterElectricLevel = function(N,I,S) {
  zway.devices[N].instances[I].Meter.Get();
  switch (S)
  {
  case 0:
    return Math.round((zway.devices[N].instances[I].Meter.data[S].val.value)*1000);
  break;
  case 2:
    return Math.round((zway.devices[N].instances[I].Meter.data[S].val.value)*10)/10;
  break;  
  }
}  

/*MeterElectricReset(N,I)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/MeterElectricReset(N,I)
*/
MeterElectricReset = function(N,I) {
  zway.devices[N].instances[I].Meter.Reset();
}

/* Next section contains a number of SensorMultilevel variants.
Note: On the Raspberry in the Z-way subdirectory translations/Scales.xml you
can find the standard names and their translations. I think they do follow the
index numbers for the apropriate "data" element. Use that for other specific 
sensors.
*/

/*TemperatureLevel(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/TemperatureLevel(N)
*/
TemperatureLevel = function(N) {
  zway.devices[N].instances[0].SensorMultilevel.Get();
  return zway.devices[N].instances[0].SensorMultilevel.data[1].val.value;
}

/*HumidityLevel(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/HumidityLevel(N)
*/
HumidityLevel = function(N) {
  zway.devices[N].instances[0].SensorMultilevel.Get();
  return zway.devices[N].instances[0].SensorMultilevel.data[5].val.value;
}

/*LuminescenceLevel(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/LuminescenceLevel(N)
*/
LuminescenceLevel = function(N) {
  zway.devices[N].instances[0].SensorMultilevel.Get();
  return zway.devices[N].instances[0].SensorMultilevel.data[3].val.value;
}


/*DoorLock(N)
 Openremote usage: http://raspberry_IP:8083/JS/Run/DoorLock(N)
*/ 
 DoorLock = function(N) {
	return zway.devices[N].instances[0].DoorLock.Set(255);
    }	
	
/*DoorUnLock(N)
 Openremote usage: http://raspberry_IP:8083/JS/Run/DoorUnLock(N)
 */
DoorUnLock = function(N) {
	return zway.devices[N].instances[0].DoorLock.Set(0);
	}

	
/*DeviceName(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/DeviceName(N)
Use Regular Expression [\w\s]{1,} in the Http call to get rid of quotes in returned value
*/
 DeviceName = function(N) {
   return zway.devices[N].instances[0].NodeNaming.data.nodename.value;
 }

/*DeviceLocation(N)
OpenRemote usage: http://raspberry_IP:8083/JS/Run/DeviceLocation(N)
Use Regular Expression [\w\s]{1,} in the Http call to get rid of quotes in returned value
*/
 DeviceLocation = function(N) {
   return zway.devices[N].instances[0].NodeNaming.data.location.value;
 }
 
//List all functions with command: grep -P '^\/\*.*$' openremote.js 