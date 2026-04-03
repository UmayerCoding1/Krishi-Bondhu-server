import slugify from "slugify";

const cretateSlug = async (text: string) => {
    return (slugify as any)(text, { lower: true, strict: true });
}

export default cretateSlug