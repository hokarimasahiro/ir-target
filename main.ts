pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
let sTime = 0
let dTime = 5
basic.showIcon(IconNames.Heart)
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P2) == 0) {
        if (sTime == 0) {
            sTime = input.runningTime()
        } else {
            if (input.runningTime() > sTime + dTime) {
                basic.showIcon(IconNames.Chessboard)
                basic.pause(1000)
                basic.clearScreen()
            }
        }
        led.plot(2, 2)
    } else {
        sTime = 0
        led.unplot(2, 2)
    }
})
