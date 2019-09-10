import BinaryReader from '../BinaryReader';
import { Stream } from 'stream';
import FileTypeBox from '../FileTypeBox';
import * as fs from 'fs';

test('BinaryReader is a type of Stream', () => {
    const reader = new BinaryReader();
    expect(reader).toBeInstanceOf(Stream);
});

test('BinaryReader can by piped', done => {
    const reader = new BinaryReader();
    const fileReadStream = fs.createReadStream('../1080p2997p5mbps/event_4kinit.mp4');
    expect.hasAssertions();
    fileReadStream.on('end', () => {
        expect(true).toBe(true);
        done();
    });
    fileReadStream.pipe(reader);
});

test('BinaryReader parse File Type Box', done => {
    const reader = new BinaryReader();
    const fileReadStream = fs.createReadStream('../1080p2997p5mbps/event_4kinit.mp4');
    expect.hasAssertions();
    reader.on('ftyp', box => {
        console.log(box);
        expect(box).toBeInstanceOf(FileTypeBox);
        const {boxType, majorBrand, compatibleBrands} = box;
        expect(boxType).toBe("ftyp");
        expect(majorBrand).toBe("isom");
        expect(compatibleBrands).toEqual(expect.arrayContaining(["isom", "avc1", "dash"]));
        done();
    });
    fileReadStream.pipe(reader);
});