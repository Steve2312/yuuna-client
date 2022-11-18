const formatSeconds = (duration: number): string => {
    if (!duration) {
        return '00:00'
    }
    function format(number: number): string {
        return number.toString().padStart(2, '0')
    }
    duration = Math.round(duration)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60

    return format(minutes) + ':' + format(seconds)
}

export default formatSeconds