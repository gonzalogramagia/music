export const normalizeUrl = (url: string): string => {
    let formattedUrl = url.trim();

    if (!formattedUrl) return '';

    // If it doesn't start with http:// or https://
    if (!/^https?:\/\//i.test(formattedUrl)) {
        // If it starts with www., just add https://
        // If it doesn't start with www, also add https:// (works for youtube.com etc)
        formattedUrl = 'https://' + formattedUrl;
    }

    return formattedUrl;
};
