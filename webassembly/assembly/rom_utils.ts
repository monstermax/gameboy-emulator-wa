

class RomHeader {
    entrypoint: ArrayBuffer = new ArrayBuffer(0);
    nintendoLogo: ArrayBuffer = new ArrayBuffer(0);
    romTitle: ArrayBuffer = new ArrayBuffer(0);
    manufacturerCode: ArrayBuffer = new ArrayBuffer(0);
    cgbFlag: ArrayBuffer = new ArrayBuffer(0);
    newLicenseeCode: ArrayBuffer = new ArrayBuffer(0);
    sgbFlag: ArrayBuffer = new ArrayBuffer(0);
    cartridgeType: ArrayBuffer = new ArrayBuffer(0);
    romSize: ArrayBuffer = new ArrayBuffer(0);
    ramSize: ArrayBuffer = new ArrayBuffer(0);
    destinationCode: ArrayBuffer = new ArrayBuffer(0);
    oldLicenseeCode: ArrayBuffer = new ArrayBuffer(0);
    maskRomVersionNumber: ArrayBuffer = new ArrayBuffer(0);
    headerChecksum: ArrayBuffer = new ArrayBuffer(0);
    globalChecksum: ArrayBuffer = new ArrayBuffer(0);

    constructor(
        entrypoint: ArrayBuffer,
        nintendoLogo: ArrayBuffer,
        romTitle: ArrayBuffer,
        manufacturerCode: ArrayBuffer,
        cgbFlag: ArrayBuffer,
        newLicenseeCode: ArrayBuffer,
        sgbFlag: ArrayBuffer,
        cartridgeType: ArrayBuffer,
        romSize: ArrayBuffer,
        ramSize: ArrayBuffer,
        destinationCode: ArrayBuffer,
        oldLicenseeCode: ArrayBuffer,
        maskRomVersionNumber: ArrayBuffer,
        headerChecksum: ArrayBuffer,
        globalChecksum: ArrayBuffer,
    ) {
        this.entrypoint = entrypoint;
        this.nintendoLogo = nintendoLogo;
        this.romTitle = romTitle;
        this.manufacturerCode = manufacturerCode;
        this.cgbFlag = cgbFlag;
        this.newLicenseeCode = newLicenseeCode;
        this.sgbFlag = sgbFlag;
        this.cartridgeType = cartridgeType;
        this.romSize = romSize;
        this.ramSize = ramSize;
        this.destinationCode = destinationCode;
        this.oldLicenseeCode = oldLicenseeCode;
        this.maskRomVersionNumber = maskRomVersionNumber;
        this.headerChecksum = headerChecksum;
        this.globalChecksum = globalChecksum;
    }
}


export function getRomHeader(romFile: ArrayBuffer): RomHeader {
    const extract = (romFile: ArrayBuffer, start: u32, end: u32): ArrayBuffer => romFile.slice(start, end + 1);

    const entrypoint: ArrayBuffer = extract(romFile, 0x0100, 0x0103);
    const nintendoLogo: ArrayBuffer = extract(romFile, 0x0104, 0x0133);
    const romTitle: ArrayBuffer = extract(romFile, 0x0134, 0x0143);
    const manufacturerCode: ArrayBuffer = extract(romFile, 0x013F, 0x0142);
    const cgbFlag: ArrayBuffer = extract(romFile, 0x0143, 0x0143);
    const newLicenseeCode: ArrayBuffer = extract(romFile, 0x0144, 0x0145);
    const sgbFlag: ArrayBuffer = extract(romFile, 0x0146, 0x0146);
    const cartridgeType: ArrayBuffer = extract(romFile, 0x0147, 0x0147);
    const romSize: ArrayBuffer = extract(romFile, 0x0148, 0x0148);
    const ramSize: ArrayBuffer = extract(romFile, 0x0149, 0x0149);
    const destinationCode: ArrayBuffer = extract(romFile, 0x014A, 0x014A);
    const oldLicenseeCode: ArrayBuffer = extract(romFile, 0x014B, 0x014B);
    const maskRomVersionNumber: ArrayBuffer = extract(romFile, 0x014C, 0x014C);
    const headerChecksum: ArrayBuffer = extract(romFile, 0x014D, 0x014D);
    const globalChecksum: ArrayBuffer = extract(romFile, 0x014E, 0x014F);


    const romHeader = new RomHeader(
        entrypoint,
        nintendoLogo,
        romTitle,
        manufacturerCode,
        cgbFlag,
        newLicenseeCode,
        sgbFlag,
        cartridgeType,
        romSize,
        ramSize,
        destinationCode,
        oldLicenseeCode,
        maskRomVersionNumber,
        headerChecksum,
        globalChecksum,
    )

    return romHeader
}


