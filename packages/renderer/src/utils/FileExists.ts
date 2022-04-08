import * as fs from "fs";

const fileExists = async (src: string): Promise<boolean> => {
    try {
        await fs.promises.access(src);
        return true;
    } catch {
        return false;
    }
}

export default fileExists;