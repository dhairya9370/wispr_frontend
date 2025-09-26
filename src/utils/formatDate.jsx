export default function formatDate(date) {
    const inputDate = new Date(date);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const input = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const diffDays = Math.floor((today - input) / 86400000);

    if (diffDays === 0) {
        return "Today"
    } else if (diffDays === 1) {
        return "Yesterday";
    } else {
        const dd = String(inputDate.getDate()).padStart(2, '0');
        const mm = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const yyyy = inputDate.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }
}
