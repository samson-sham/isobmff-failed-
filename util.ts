export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

export interface Constructable<T> {
    new(...args: any[]): T;
}

export function typedArrayToASCII(typedArray: TypedArray) {
    return Array.prototype.map.call(typedArray, byte => String.fromCharCode(byte)).join('');
}
export function concatTypedArray(a: TypedArray, b: TypedArray): TypedArray {
    const newArray = new (a.constructor as Constructable<TypedArray>)(a.length + b.length);
    newArray.set(a, 0);
    newArray.set(b, a.length);
    return newArray;
}
export function getAtom(typedArray: TypedArray): TypedArray {
    const atomLength = (new DataView(typedArray.buffer, 0, 4)).getUint32(0);
    return typedArray.subarray(4, atomLength);
}