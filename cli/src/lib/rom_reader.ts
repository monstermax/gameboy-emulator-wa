

import path from 'path';
import fs from 'fs';


const romDir = path.join(__dirname, '../../../roms'); // Load ROM from local filesystem
const romBaseUrl = 'http://localhost:3240/roms';      // Load ROM from HTTP endpoint


export function readRom(romFilename: string): Buffer<ArrayBuffer> {
    const romFilepath = `${romDir}/${romFilename}`;

    console.log(`[CLI] Reading ROM from ${romFilepath}`);

    if (!fs.existsSync(romFilepath)) {
        console.error(`Rom file not found`);
        process.exit(1);
    }

    const romFile: Buffer<ArrayBuffer> = fs.readFileSync(romFilepath);

    return romFile
}


export async function fetchRom(romFilename: string): Promise<Buffer<ArrayBuffer>> {
    const romFileurl = `${romBaseUrl}/${romFilename}`;

    console.log(`[CLI] Fetching ROM from ${romFileurl}`);

    const response = await fetch(romFileurl);

    const romFile: ArrayBuffer = await response.arrayBuffer()

    const buf = Buffer.from(romFile)

    return buf
}

