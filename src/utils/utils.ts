
export function validateText(val: string,regex: string, emptyAllowed: boolean){
    if (val.length === 0 && emptyAllowed) return true; 
    const validText = new RegExp(regex);
    const retVal = validText.test(val)
    console.log(retVal)
    return retVal;
}