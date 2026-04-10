import { fileValidator } from "../utils/fileValidator";


export class FileService {
    private validator: fileValidator;

    constructor() {
        this.validator = new fileValidator(
            ["image/jpeg", "image/png", "image/webp"],
            5
        );
    }

    processUpload(file: Express.Multer.File) {
        this.validator.validate(file);

        return {
            filename: file.filename,
            path: file.path,
            size: file.size,
        };
    }
}