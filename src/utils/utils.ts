
export function validateText(val: string,regex: string, emptyAllowed: boolean){
    if (val.length === 0 && emptyAllowed) return true; 
    const validText = new RegExp(regex);
    return validText.test(val);
}

/**
     * Helper function to parse numbers from string inputs, 0 by default
     * @param val 
     * @returns 
     */
export function parseNumber(val: string) {
    const newVal = parseInt(val)
    if (newVal) return newVal;
    else return 0;
}