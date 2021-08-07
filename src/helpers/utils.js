export const formatSeconds = (duration) => {
    if (!duration) {
        return "00:00"
    }
    function format(number) {
        return number.toString().padStart(2, "0");
    }
    duration = Math.round(duration);
    var minutes = Math.floor(duration / 60);
    var seconds = duration % 60;

    return format(minutes) + ':' + format(seconds);
};

export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
}

export const preventDefault = function (e) {
    e.preventDefault();
}