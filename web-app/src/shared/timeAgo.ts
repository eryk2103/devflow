export function timeAgo(date: string | Date) {
    const now = new Date();
    const past = new Date(date);

    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (seconds < 15) {
        return "now";
    }

    if (seconds < 60) {
        return `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} h ago`;
    }

    const days = Math.floor(hours / 24);
    if (days === 1) {
        return "1 day ago";
    }

    if (days < 30) {
        return `${days} days ago`;
    }

    const months = Math.floor(days / 30);
    if (months === 1) {
        return "1 month ago"
    }

    return `${months} months ago`;

}