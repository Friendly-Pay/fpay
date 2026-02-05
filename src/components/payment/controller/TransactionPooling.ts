export class TransactionPooling {
    private intervalId: number = 0;
    private readonly intervalMs: number;
    private readonly task: () => Promise<void>;

    constructor(task: () => Promise<void>, intervalMs: number) {
        this.task = task;
        this.intervalMs = intervalMs;
    }

    start() {
        if (this.intervalId) return;

        void this.task();

        this.intervalId = window.setInterval(() => {
            void this.task();
        }, this.intervalMs);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = 0;
        }
    }
}