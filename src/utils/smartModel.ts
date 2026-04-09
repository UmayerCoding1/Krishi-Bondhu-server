export const getSmartModels = (message: string) => {
    if (message.length < 50) {
        return [
            'openai/gpt-oss-120b:free',
            "google/gemma-4-31b-it:free",
        ]
    }

    return [
        'openai/gpt-oss-120b:free',
        "google/gemma-4-31b-it:free",
    ]
} 