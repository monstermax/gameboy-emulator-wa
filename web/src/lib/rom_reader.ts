

const romBaseUrl = '/roms'; // Load ROM from HTTP endpoint


export async function fetchRom(romFilename: string): Promise<Buffer<ArrayBuffer>> {
    const romFileurl = `${romBaseUrl}/${romFilename}`;

    console.log(`Fetching ROM from ${romFileurl}`);

    const response = await fetch(romFileurl);

    const romFile: ArrayBuffer = await response.arrayBuffer()

    const buf = Buffer.from(romFile)

    return buf
}

