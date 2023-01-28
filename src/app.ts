import { readFile } from 'node:fs/promises';
import { LoggingService } from './services/logging.service.js';

const logging = new LoggingService();

try {
    const tennisPlayers: string = await readFile('data.csv', { encoding: 'utf8' }); // using readFile since the data set is small. Larger files should update to streams.
    logging.log("FATAL", "Oops 1");
  } catch (error) {
    console.error('there was an error:', error.message);
}
