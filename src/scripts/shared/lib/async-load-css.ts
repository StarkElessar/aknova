export const asyncLoadCSS = (href: string) => {
    return new Promise<void>(resolve => {
        if (document.head.querySelector(`link[href="${href}"]`)) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.onload = () => resolve();
        document.head.append(link);
    });
};