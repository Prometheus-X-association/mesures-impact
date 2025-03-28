/**
 *
 */
export function displayAsset(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = value;
    }
}
