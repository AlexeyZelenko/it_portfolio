export const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
};

export const truncateDescription = (description, length = 100) => {
    if (!description) return '';
    return description.length > length
        ? `${description.substring(0, length)}...`
        : description;
};