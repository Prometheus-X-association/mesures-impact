/**
 *
 */

export function displayAsset(id: string, value: 'none' | 'block' | 'inline' | 'inline-block' | 'flex'): void {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = value;
    }
}