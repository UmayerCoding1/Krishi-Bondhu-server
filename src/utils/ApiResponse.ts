export class ApiResponse<T> {
    constructor(
        public statusCode: number,
        public message: string = "Success",
        public data?: T
    ) { }

    get success(): boolean {
        return this.statusCode < 400;
    }
}