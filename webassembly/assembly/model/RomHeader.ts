

export class RomHeader {
    entrypoint: Uint8Array = new Uint8Array(0);
    nintendoLogo: Uint8Array = new Uint8Array(0);
    romTitle: Uint8Array = new Uint8Array(0);
    manufacturerCode: Uint8Array = new Uint8Array(0);
    cgbFlag: Uint8Array = new Uint8Array(0);
    newLicenseeCode: Uint8Array = new Uint8Array(0);
    sgbFlag: Uint8Array = new Uint8Array(0);
    cartridgeType: Uint8Array = new Uint8Array(0);
    romSize: Uint8Array = new Uint8Array(0);
    ramSize: Uint8Array = new Uint8Array(0);
    destinationCode: Uint8Array = new Uint8Array(0);
    oldLicenseeCode: Uint8Array = new Uint8Array(0);
    maskRomVersionNumber: Uint8Array = new Uint8Array(0);
    headerChecksum: Uint8Array = new Uint8Array(0);
    globalChecksum: Uint8Array = new Uint8Array(0);

    constructor(
        entrypoint: Uint8Array,
        nintendoLogo: Uint8Array,
        romTitle: Uint8Array,
        manufacturerCode: Uint8Array,
        cgbFlag: Uint8Array,
        newLicenseeCode: Uint8Array,
        sgbFlag: Uint8Array,
        cartridgeType: Uint8Array,
        romSize: Uint8Array,
        ramSize: Uint8Array,
        destinationCode: Uint8Array,
        oldLicenseeCode: Uint8Array,
        maskRomVersionNumber: Uint8Array,
        headerChecksum: Uint8Array,
        globalChecksum: Uint8Array,
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


export function getRomHeader(romFile: Uint8Array): RomHeader {
    const extract = (romFile: Uint8Array, start: u32, end: u32): Uint8Array => romFile.slice(start, end + 1);

    const entrypoint = extract(romFile, 0x0100, 0x0103);
    const nintendoLogo = extract(romFile, 0x0104, 0x0133);
    const romTitle = extract(romFile, 0x0134, 0x0143);
    const manufacturerCode = extract(romFile, 0x013F, 0x0142);
    const cgbFlag = extract(romFile, 0x0143, 0x0143);
    const newLicenseeCode = extract(romFile, 0x0144, 0x0145);
    const sgbFlag = extract(romFile, 0x0146, 0x0146);
    const cartridgeType = extract(romFile, 0x0147, 0x0147);
    const romSize = extract(romFile, 0x0148, 0x0148);
    const ramSize = extract(romFile, 0x0149, 0x0149);
    const destinationCode = extract(romFile, 0x014A, 0x014A);
    const oldLicenseeCode = extract(romFile, 0x014B, 0x014B);
    const maskRomVersionNumber = extract(romFile, 0x014C, 0x014C);
    const headerChecksum = extract(romFile, 0x014D, 0x014D);
    const globalChecksum = extract(romFile, 0x014E, 0x014F);


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


