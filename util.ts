// export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

// export interface Constructable<T> {
//     new(...args: any[]): T;
// }

export function typedArrayToASCII(typedArray: Buffer) {
    return Array.prototype.map.call(typedArray, byte => String.fromCharCode(byte)).join('');
}
// export function concatTypedArray(a: TypedArray, b: TypedArray): TypedArray {
//     const newArray = new (a.constructor as Constructable<TypedArray>)(a.length + b.length);
//     newArray.set(a, 0);
//     newArray.set(b, a.length);
//     return newArray;
// }
