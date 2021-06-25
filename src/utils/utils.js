export const formatSeconds = (duration) => {

    function format(number) {
        return number.toString().padStart(2, "0");
    }
    
    var minutes = Math.floor(duration / 60);
    var seconds = duration % 60;

    return format(minutes) + ':' + format(seconds);
};