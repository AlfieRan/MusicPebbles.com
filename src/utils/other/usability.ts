const escapeKeys = ["Escape", "Esc", "Space", " ", ""];

export function setupKeyPresses(hideComponent: (value?: boolean) => void) {
    function handleKeyPress(e: KeyboardEvent) {
        if (escapeKeys.includes(e.key)) {
            hideComponent(true);
        }
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
        document.removeEventListener("keydown", handleKeyPress);
    };
}
