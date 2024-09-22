function formatDate(dateString) {
    // Parse the date string
    const date = new Date(dateString);

    // Get the day of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    // Get the day of the month with ordinal suffix
    const dayOfMonth = date.getDate();
    const ordinalSuffix = (n) => {
        if (n > 3 && n < 21) return 'th'; // covers 11th to 20th
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    const dayWithSuffix = `${dayOfMonth}${ordinalSuffix(dayOfMonth)}`;

    // Get the month name
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = months[date.getMonth()];

    // Get the year
    const year = date.getFullYear();

    // Combine everything into the desired format
    return `${dayOfWeek} ${dayWithSuffix} ${monthName} ${year}`;
}

function getDateRange(startDateStr, days) {
    // Parse the start date
    const startDate = new Date(startDateStr);
    const result = [];

    // Loop to generate the range of dates
    for (let i = 0; i < days; i++) {
        // Format the date as YYYY-MM-DD
        const formattedDate = startDate.toISOString().split('T')[0];
        result.push(formattedDate);

        // Increment the date by one day
        startDate.setDate(startDate.getDate() + 1);
    }

    return result;
}

function getTodayDate() {
    const today = new Date();

    // Extract the year, month, and day
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');

    // Format the date as YYYY-MM-DD
    return `${year}-${month}-${day}`;
}

function decrementDate(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Decrement the date by one day
    date.setDate(date.getDate() - 1);

    // Format the date back into YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function incrementDate(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Increment the date by one day
    date.setDate(date.getDate() + 1);

    // Format the date back into YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default { formatDate, getDateRange, getTodayDate, incrementDate, decrementDate, formatTime };
