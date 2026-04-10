export class fileValidator {
    private allowedTypes: string[];
    private maxSize: number;

    constructor(allowedTypes: string[], maxSize: number) {
        this.allowedTypes = allowedTypes;
        this.maxSize = maxSize;
    }

    validate(file: Express.Multer.File) {
        if (!file) {
            throw new Error("File is required");
        }

        if (!this.allowedTypes.includes(file.mimetype)) {
            throw new Error("Invalid file type");
        }

        if (file.size > this.maxSize) {
            throw new Error("File too large");
        }

        return true;
    }
}