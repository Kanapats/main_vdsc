let msg = ""
let status = 0
radio.setGroup(38)
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("AP-TPslow", "")
if (ESP8266_IoT.wifiState(true)) {
    basic.showIcon(IconNames.Yes)
    basic.pause(2000)
    basic.clearScreen()
} else if (ESP8266_IoT.wifiState(false)) {
    basic.showIcon(IconNames.No)
    basic.pause(2000)
    basic.clearScreen()
}
basic.showIcon(IconNames.Diamond)
basic.forever(function () {
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setData(
    "LTYT63WPPHOK9BWJ",
    status,
    Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C)
    )
    ESP8266_IoT.uploadData()
    msg = serial.readLine()
    if (msg == "Normal") {
        status = 0
        pins.digitalWritePin(DigitalPin.P1, 1)
        pins.digitalWritePin(DigitalPin.P2, 0)
        radio.sendNumber(0)
    } else if (msg == "Danger") {
        status = 1
        pins.digitalWritePin(DigitalPin.P1, 0)
        pins.digitalWritePin(DigitalPin.P2, 1)
        radio.sendNumber(1)
    }
})
