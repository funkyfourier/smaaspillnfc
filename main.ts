function findCreature (thisNfcId: string) {
    if (thisNfcId.compare("read error!") == 0) {
        return currentCreature
    }
    if (thisNfcId.compare("passwd error!") == 0) {
        return currentCreature
    }
    nfcIdNum = parseFloat(thisNfcId)
    if (nfcIdNum >= 1 && nfcIdNum <= 15) {
        return nfcIdNum
    } else {
        return -1
    }
}
function buildSoundOffString (creature: number) {
    return "0," + creature
}
function isValidRead (nfcId: string) {
    validRead = 1
    if (findCreature(nfcId) <= 0) {
        validRead = 0
    }
    if (currentCreature > 0 && currentCreature != findCreature(nfcId)) {
        validRead = 0
    }
    return validRead
}
function buildSoundOnString (creature: number, speaker: number) {
    return "1," + ("" + creature + ",") + speaker
}
let nfcId = ""
let validRead = 0
let nfcIdNum = 0
let currentCreature = 0
radio.setGroup(45)
radio.setTransmitPower(7)
let ReadState = 1
let speaker = 5
basic.forever(function () {
    nfcId = NFC.readDataByte(NFC.blockList(DataBlockList.block_4), NFC.nfcDataList(1))
    serial.writeLine("nfId: " + nfcId)
    if (isValidRead(nfcId) == 1) {
        if (ReadState == 1) {
            currentCreature = findCreature(nfcId)
            ReadState = 0
            serial.writeLine("" + (buildSoundOnString(currentCreature, speaker)))
            radio.sendString("" + (buildSoundOnString(currentCreature, speaker)))
            basic.showString("R")
        }
    } else {
        if (ReadState == 0) {
            serial.writeLine("" + (buildSoundOffString(currentCreature)))
            radio.sendString("" + (buildSoundOffString(currentCreature)))
            currentCreature = -1
        }
        ReadState = 1
        basic.showString("0")
    }
    basic.pause(100)
})
