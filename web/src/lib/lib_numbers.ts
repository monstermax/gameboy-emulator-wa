

export function toHex(intValue: number, padleft=0): `0x${string}` {
    //if (intValue === null) return 'NULL'; // ne derait pas etre null. sauf pour cas de debug temporaire
    if (intValue === undefined) return '0xUNDEFINED'; // ne derait pas etre undefined. sauf pour cas de debug temporaire

    const hex = intValue.toString(16).toUpperCase();
    let val = (hex.length % 2 === 0 ? hex : `0${hex}`);

    if (padleft && val.length < padleft) {
        val = val.padStart(padleft, '0')
    }

    return ('0x' + val) as `0x${string}`;
}


