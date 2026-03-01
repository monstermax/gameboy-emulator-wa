

export function getRomHeader(romFile: Buffer<ArrayBuffer>) {
    const extract = (start: number, end: number) => romFile.subarray(start, end + 1);

    const entrypoint = extract(0x0100, 0x0103);
    const nintendoLogo = extract(0x0104, 0x0133);
    const romTitle = extract(0x0134, 0x0143);
    const manufacturerCode = extract(0x013F, 0x0142);
    const cgbFlag = extract(0x0143, 0x0143);
    const newLicenseeCode = extract(0x0144, 0x0145);
    const sgbFlag = extract(0x0146, 0x0146);
    const cartridgeType = extract(0x0147, 0x0147);
    const romSize = extract(0x0148, 0x0148);
    const ramSize = extract(0x0149, 0x0149);
    const destinationCode = extract(0x014A, 0x014A);
    const oldLicenseeCode = extract(0x014B, 0x014B);
    const maskRomVersionNumber = extract(0x014C, 0x014C);
    const headerChecksum = extract(0x014D, 0x014D);
    const globalChecksum = extract(0x014E, 0x014F);


    return {
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
    }
}


