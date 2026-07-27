export const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

export const formatNumberCompactShort = (number) => {
    if (isNaN(number)) {
        return number;
    }
    const formatter = new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
    });

    return formatter.format(number);
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Get hours, minutes, date, month, and year
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so we add 1
    const year = date.getFullYear();

    // Convert to 12-hour format and determine AM or PM
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours || 12; // The hour '0' should be '12'

    // Pad minutes with a leading zero if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Format the final string
    const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;

    return formattedDate;
};

export const objectToKeyValuesArrays = (object) => {
    const keys = [];
    const values = [];

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            keys.push(key);
            values.push(object[key]);
        }
    }

    return { labels: keys, data: values };
};
