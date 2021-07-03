import fs from 'fs';
import extract from 'extract-zip';

export const copy = (src, target) => {
    return new Promise((resolve, reject) => {
        fs.copyFile(src, target, (err) => {
            if (err) {
                reject(err);
            }
            resolve(err);
        });
    });
}

export const getFilesInDirectory = (src) => {
    return new Promise((resolve, reject) => {
        fs.readdir(src, (err, files) => {
            if (err) {
                reject(err);
            }
            return resolve(files);
        });
    });
}

export const readFile = (src) => {
    return new Promise((resolve, reject) => {
        fs.readFile(src, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.toString());
        });
    });
}

export const deleteDirectory = (src) => {
    fs.rmdir(src, { recursive: true }, () => {
        console.log("Removed directory: " + src);
    });
}

export const deleteFile = (src) => {
    fs.unlink(src, () => {
        console.log("Removed files: " + src);
    });
}

export const unzip = async (src) => {
    const target = src.split(".").shift();
    try {
        await extract(src, { dir: target });
        deleteDirectory(src);
        return target;
    } catch {
        console.log("Error extracting: " + src);
        deleteDirectory(src);
        deleteDirectory(target);
        return;
    }
}

export const createDirectory = (target) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(target, {recursive: true}, (err) => {
            if (err) {
                reject(err);
            }
            resolve(target)
        });
    });
}

export const createFile = (data, target) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(target, data, 'utf8', (err) => {
            if (err) {
                reject(err);
            }
            resolve(target);
        });
    });
}

export const moveFile = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(err);
        });
    });
}

export const directoryExists = (target) => {
    return fs.existsSync(target);
}