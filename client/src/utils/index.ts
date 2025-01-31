export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1) || '';
}

export const toTitleCase = (str: string): string => {
    return str.toLowerCase().split(" ").map(word => capitalizeFirstLetter(word)).join(" ") || '';
}

export const validateFields = (fields: Array<string>, data: Record<string, string>): Record<string, string> => {
    const errors: Record<string, string> = {}
    fields.forEach(field => {
        if (!data[field]) {
            errors[field] = `${toTitleCase(field)} is required`
        }
    })
    return errors
}