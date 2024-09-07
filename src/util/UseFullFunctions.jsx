function convertSecondsToTimeString(seconds) {
    const duration = parseFloat(seconds);
    if (isNaN(duration) || duration < 0) {
        return '0s';
    }
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const remainingSeconds = duration % 60;

    const parts = [];

    if(hours == 0 && minutes == 0){
        return `${minutes} min`;
    }

    if (hours > 0) {
        parts.push(`${hours} h`);
    }
    if (minutes > 0) {
        parts.push(`${minutes} min`);
    }

    return parts.join(', ');
}

export {
    convertSecondsToTimeString
}