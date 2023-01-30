import { writeFile } from 'node:fs/promises';

export class LoggingService {

    private count: number = 0;
    private batchSize: number = 5;
    private logMessages: string = null;
    
    constructor() { }

    public log(severity: string, message: string): void {
        let logTimeMiliseconds: number = new Date().getMilliseconds();
        let logMessages: string = `\nTime(Miliseconds) :: ${logTimeMiliseconds}. Severity :: ${severity}. Message :: ${message} !!`;

        this.addLogMessage(logMessages);
    }

    private addLogMessage(logMessage: string): void {
        if (this.logMessages === null) {
            this.logMessages = logMessage;
        } else {
            this.logMessages += logMessage;
        }
        this.checkBufferSize();
    }

    private checkBufferSize(): void {
        this.count++;

        /* 
        * Disclaimer.
        * I should clear the logMessages, currently the implementation will only log once the count matches the batchSize.
        * Impact: logs may be lost, or never written.
        */
        if (this.count === this.batchSize) {
            this.writeLog();
            this.clearCount();
            this.clearLogMessages();
        }
    }

    private async writeLog(): Promise<void> {
        try {
            await writeFile('logs.txt', this.logMessages, { flag: 'a' });
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    }

    private clearCount(): void {
        this.count = 0;
    }

    private clearLogMessages(): void {
        this.logMessages = null;
    }
}