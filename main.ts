function コマンド受信 (コマンド: string) {
    serial.writeLine(コマンド)
    cmd = コマンド.split(",")
    if (cmd[1] == "RESET") {
        initProc()
    } else if (cmd[0] == control.deviceName()) {
        if (cmd[1].charAt(0) == "S") {
            mode = 1
            waitTime = parseFloat(cmd[2])
            dataTime = parseFloat(cmd[3])
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
function initProc () {
    dataStratTime = 0
    dataTime = 5
    mode = 0
    saveString = ""
    radioGroup = 0
    getradiogroup.initRadioGroup()
    basic.showIcon(IconNames.Heart)
}
function 赤外線受信 () {
    if (input.runningTime() < startTime + waitTime) {
        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
            if (dataStratTime == 0) {
                dataStratTime = input.runningTime()
            } else {
                if (input.runningTime() > dataStratTime + dataTime) {
                    mode = 0
                    radio.sendString("" + control.deviceName() + "," + "HIT")
                    basic.showIcon(IconNames.Chessboard)
                    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.UntilDone)
                    basic.clearScreen()
                }
            }
        } else {
            dataStratTime = 0
        }
    } else {
        mode = 0
        radio.sendString("" + control.deviceName() + "," + "TO")
        mode = 0
        basic.clearScreen()
    }
}
radio.onReceivedString(function (receivedString) {
    saveString = receivedString
})
let radioGroup = 0
let saveString = ""
let dataStratTime = 0
let startTime = 0
let dataTime = 0
let waitTime = 0
let mode = 0
let cmd: string[] = []
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
initProc()
basic.forever(function () {
    if (radioGroup == 0) {
        radioGroup = getradiogroup.getRadioGroup(saveString)
        saveString = ""
        if (radioGroup != 0) {
            watchfont.showNumber2(radioGroup)
            radio.setTransmitPower(7)
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
    led.plotBrightness(2, 2, (1 - pins.digitalReadPin(DigitalPin.P2)) * 255)
})
