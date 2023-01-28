import { readFile, writeFile } from 'node:fs/promises';

try {
    const tennisPlayers: string = await readFile('data.csv', { encoding: 'utf8' }); // using readFile since the data set is small. Larger files should update to streams.
  } catch (error) {
    console.error('there was an error:', error.message);
}

try {
   let content = "\na logs"
    await writeFile('logs.txt', content, { flag: 'a' });
  } catch (error) {
    console.error('there was an error:', error.message);
}
