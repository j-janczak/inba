module.exports = {
    getDate(timeStamp) {
        let date = new Date(timeStamp);
        let hours = (date.getHours() < 10 ? `0${date.getHours()}` : date.getHours());
        let minutes = (date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes());
        let seconds = (date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds());
        let day = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
        let month = (date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1);
        let year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} - ${day}.${month}.${year}`;
    },
    argToTime(arg) {
        var timeStamp = 0;
        var success = false;
        var argTime = null;
        if (argTime = arg.match(/^(\d{1,2}d)?(\d{1,2}h)?(\d{1,4}m)?$/g)) {
            var argTimeArray = null;
            if (argTimeArray = argTime[0].match(/(\d{1,4}[dhm])/g)) {
                argTimeArray.forEach(timePart => {
                    if (timePart.search(`d`) != -1) {
                        timePart.replace(`d`, ``);
                        timeStamp += 86400000 * parseInt(timePart);
                    }
                    else if (timePart.search(`h`) != -1) {
                        timePart.replace(`h`, ``);
                        timeStamp += 3600000 * parseInt(timePart);
                    }
                    else if (timePart.search(`m`) != -1) {
                        timePart.replace(`m`, ``);
                        timeStamp += 60000 * parseInt(timePart);
                    }
                });
                success = true;
            }
        }
        if (timeStamp > 2592000000) success = false;
        else timeStamp += (new Date()).getTime();
        if(success) {
            return timeStamp;
        } else return false;
    }
};
