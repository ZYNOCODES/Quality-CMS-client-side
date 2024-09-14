import moment from 'moment';

const convertSecondsToTimeString = (seconds) => {
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

    return parts.join(' ');
};
const formatDateTime = (dateString) => {
    moment.locale('fr'); // Set locale to French for month names
    return moment.utc(dateString).format('D MMMM YYYY [at] HH:mm:ss');
};
const formatDate = (dateString) => {
    moment.locale('fr'); // Set locale to French for month names
    return moment.utc(dateString).format('D MMMM YYYY');
};
const formatDuration = (mill) => {
    // Handle case where mill is null or undefined
    if (mill === null || mill === undefined) {
        return "Durée non disponible";
    }

    // Create duration object
    const duration = moment.duration(mill);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // Build the formatted duration string
    let formattedDuration = '';

    if (days > 0) {
        formattedDuration += `${days} jour${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0) {
        formattedDuration += `${hours} heure${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
        formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    if (seconds > 0 || formattedDuration === '') { // Include seconds if no other units are present
        formattedDuration += `${seconds} seconde${seconds > 1 ? 's' : ''}`;
    }

    return formattedDuration || "0 secondes";
};

export {
    convertSecondsToTimeString,
    formatDateTime,
    formatDate,
    formatDuration
}