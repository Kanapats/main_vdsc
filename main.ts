let status = 0
radio.setGroup(38)
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("Kanapat", "01234567")
if (ESP8266_IoT.wifiState(true)) {
    basic.showIcon(IconNames.Yes)
    basic.pause(2000)
    basic.clearScreen()
} else if (ESP8266_IoT.wifiState(false)) {
    basic.showIcon(IconNames.No)
    basic.pause(2000)
    basic.clearScreen()
}
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.OBJECTCLASSIFICATION)
huskylens.writeOSD("VDSC", 150, 30)
huskylens.writeName(1, "Normal")
huskylens.writeName(2, "Danger")
basic.showIcon(IconNames.Diamond)
basic.forever(function () {
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setData(
    "LTYT63WPPHOK9BWJ",
    status,
    Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C)
    )
    ESP8266_IoT.uploadData()
    huskylens.request()
    if (huskylens.isAppear(1, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
        status = 0
        pins.digitalWritePin(DigitalPin.P1, 1)
        pins.digitalWritePin(DigitalPin.P2, 0)
        radio.sendNumber(0)
    } else if (huskylens.isAppear(2, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
        huskylens.takePhotoToSDCard(HUSKYLENSphoto.PHOTO)
        status = 1
        pins.digitalWritePin(DigitalPin.P1, 0)
        pins.digitalWritePin(DigitalPin.P2, 1)
        radio.sendNumber(1)
    }
})
