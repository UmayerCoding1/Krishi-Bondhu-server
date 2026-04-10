import multer from "multer";

export class Uploader {
    static single(fieldName: string) {
        return multer().single(fieldName);
    }

    static multiple(fieldName: string, count: number) {
        return multer().array(fieldName, count);
    }
}