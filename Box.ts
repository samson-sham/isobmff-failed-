import {typedArrayToASCII, TypedArray} from './util';
interface BoxInterface {
    boxType: string
}
export default class Box implements BoxInterface {
    public boxType: string
    protected _anchor: number
    constructor() {
        this.boxType = "unknown";
        this._anchor = 0;
    }
    parse(typedArray: TypedArray): boolean {
        this.boxType = this.readString(typedArray);
        return !this.boxType.match(/[^a-zA-Z0-9]/);
    }
    protected readString(typedArray: TypedArray, bit: number = 32): string {
        const result = typedArrayToASCII(typedArray.subarray(this._anchor,this._anchor+4));
        this._anchor += 4;
        return result;
    }
    // protected readNumber(dataView: data) {
        
    // }
}