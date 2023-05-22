const phoneWidth = 768;

function getScreenSize(): { width: number; height: number } {
    return { width: window.innerWidth, height: innerHeight };
}

export function isMobile(): boolean | undefined {
    const { width } = getScreenSize();
    return width <= phoneWidth;
}
