function コマンド受信 (コマンド: string) {
    serial.writeLine(コマンド)
    cmd = コマンド.split(",")
    if (cmd[0] == control.deviceName()) {
        if (cmd[2] == "START") {
            mode = 1
            waitTime = parseFloat(cmd[3])
            dataTime = parseFloat(cmd[4])
            startTime = input.runningTime()
            basic.showLeds(`
                . # # # .
                # . . . #
                # . . . #
                # . . . #
                . # # # .
                `)
        }
    }
}
function 赤外線受信 () {
    if (input.runningTime() < startTime + waitTime) {
        if (pins.digitalReadPin(DigitalPin.P0) == 0) {
            if (dataStratTime == 0) {
                dataStratTime = input.runningTime()
            } else {
                if (input.runningTime() > dataStratTime + dataTime) {
                    radio.sendString("" + cmd[1] + "," + control.deviceName() + "," + "HIT")
                    basic.showIcon(IconNames.Chessboard)
                    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.UntilDone)
                    basic.clearScreen()
                }
            }
            led.plot(2, 2)
        } else {
            dataStratTime = 0
            led.unplot(2, 2)
        }
    } else {
        radio.sendString("" + cmd[1] + "," + control.deviceName() + "," + "TO")
        mode = 0
        basic.clearScreen()
    }
}
radio.onReceivedString(function (receivedString) {
    saveString = receivedString
})
let startTime = 0
let waitTime = 0
let cmd: string[] = []
let saveString = ""
let mode = 0
let dataTime = 0
let dataStratTime = 0
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
dataStratTime = 0
dataTime = 5
mode = 0
saveString = ""
let radioGroup = 0
getradiogroup.initRadioGroup()
basic.showIcon(IconNames.Heart)
basic.forever(function () {
    if (radioGroup == 0) {
        radioGroup = getradiogroup.getRadioGroup(saveString)
        saveString = ""
        if (radioGroup != 0) {
            watchfont.showNumber2(radioGroup)
        }
    } else {
        if (saveString != "") {
            コマンド受信(saveString)
            saveString = ""
        } else {
            if (mode != 0) {
                赤外線受信()
            }
        }
    }
})
