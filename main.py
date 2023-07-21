status = 0
radio.set_group(38)
ESP8266_IoT.init_wifi(SerialPin.P8, SerialPin.P12, BaudRate.BAUD_RATE115200)
ESP8266_IoT.connect_wifi("Kanapat", "01234567")
if ESP8266_IoT.wifi_state(True):
    basic.show_icon(IconNames.YES)
    basic.pause(2000)
    basic.clear_screen()
elif ESP8266_IoT.wifi_state(False):
    basic.show_icon(IconNames.NO)
    basic.pause(2000)
    basic.clear_screen()
huskylens.init_i2c()
huskylens.init_mode(protocolAlgorithm.OBJECTCLASSIFICATION)
huskylens.write_osd("VDSC", 150, 30)
huskylens.write_name(1, "Normal")
huskylens.write_name(2, "Danger")
basic.show_icon(IconNames.DIAMOND)

def on_forever():
    global status
    ESP8266_IoT.connect_thing_speak()
    ESP8266_IoT.set_data("LTYT63WPPHOK9BWJ",
        status,
        Environment.octopus_BME280(Environment.BME280_state.BME280_TEMPERATURE_C))
    ESP8266_IoT.upload_data()
    huskylens.request()
    if huskylens.is_appear(1, HUSKYLENSResultType_t.HUSKYLENS_RESULT_BLOCK):
        status = 0
        pins.digital_write_pin(DigitalPin.P1, 1)
        pins.digital_write_pin(DigitalPin.P2, 0)
        radio.send_number(0)
    elif huskylens.is_appear(2, HUSKYLENSResultType_t.HUSKYLENS_RESULT_BLOCK):
        huskylens.take_photo_to_sd_card(HUSKYLENSphoto.PHOTO)
        status = 1
        pins.digital_write_pin(DigitalPin.P1, 0)
        pins.digital_write_pin(DigitalPin.P2, 1)
        radio.send_number(1)
basic.forever(on_forever)
