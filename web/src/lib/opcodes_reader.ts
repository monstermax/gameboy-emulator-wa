

const opcodesBaseUrl = '/opcodes'; // Load ROM from HTTP endpoint


export async function fetchOpcodes(romFilename: string): Promise<Buffer<ArrayBuffer>> {
    const opcodesFileurl = `${opcodesBaseUrl}/${romFilename}`;

    console.log(`Fetching Opcodes from ${opcodesFileurl}`);

    const response = await fetch(opcodesFileurl);

    const instructionsSet = await response.json()

    return instructionsSet
}

