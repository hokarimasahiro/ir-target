pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
basic.showIcon(IconNames.Heart)
basic.forever(function () {
    led.plotBrightness(2, 2, pins.analogReadPin(AnalogReadWritePin.P2) * 255)
})
