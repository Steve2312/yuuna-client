const classNames = (classes: { [key: string]: boolean }): string => {
    const className = [];
  
    for (const [key,value] of Object.entries(classes)) {
        if (value) {
            className.push(key);
        }
    }

    return className.join(' ');
};

export default classNames;