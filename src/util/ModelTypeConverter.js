export const modelToType = (modelName) => {
    if (modelName === "gpt-3.5-turbo") {
        return "GPT 3.5"
    } else if (modelName === "gpt-4-turbo-preview") {
        return "GPT 4 Turbo"
    } else if (modelName === "gpt-4") {
        return "GPT 4"
    } else if (modelName === "gpt-3.5-turbo-0125") {
        return "GPT 3.5 (0125)"
    } else {
        return "FT"
    }
}