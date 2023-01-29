import { createReadStream } from 'node:fs';
import * as readline from 'node:readline/promises';

import { LoggingService } from './services/logging.service.js';

const logging = new LoggingService();

let malePlayers: Set<string> = new Set();
let femalePlayers: Set<string> = new Set();

(async () => {
try {
    const fileDataStream = await createReadStream('data.csv', { encoding: 'utf8' });
  
    const readLine = readline.createInterface({
      input: fileDataStream, // Read Stream
      output: null // 'null' - No need for Write Stream
    });
  
    for await (const dataEntry of readLine) {
      // file output per line.
    }
  } catch (error) {
    console.error("Failed to read data :: " + error);
    logging.log("Fatal", "Failed to read data :: " + error);
  }
})().then(() => {
  console.log(malePlayers);
  console.log(femalePlayers);
});

}
