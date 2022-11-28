const escapeKeys = ["Escape", "Esc", "Space", "Enter", " ", ""];
const simpleKeys = ["Escape", "Esc"];

export function setupKeyPresses(
    hideComponent: (value?: boolean) => void,
    simple: boolean
) {
    function handleKeyPress(e: KeyboardEvent) {
        if (checkKey(e.key, simple)) {
            hideComponent(true);
        }
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
        document.removeEventListener("keydown", handleKeyPress);
    };
}

function checkKey(key: string, simple: boolean) {
    if (simple) {
        console.log("simple");
        return simpleKeys.includes(key);
    }
    console.log("not simple");
    return escapeKeys.includes(key);
}
