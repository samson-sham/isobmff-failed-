import BinaryReader from './BinaryReader';
import * as fs from 'fs';

const reader = new BinaryReader();
const fileReadStream = fs.createReadStream('../1080p2997p5mbps/event_4kinit.mp4', {
    // 'highWaterMark': 20
});

reader.on('ftyp', box => {
    console.log(box);
});
fileReadStream.on('readable', () => {
    console.log("Stream is readable");
    let chunk;
    while (null !== (chunk = fileReadStream.read(20))) {
        console.log("Writing to reader stream...", chunk.length);
        reader.write(chunk);
    }
});
fileReadStream.on('end', () => {
    reader.end();
});