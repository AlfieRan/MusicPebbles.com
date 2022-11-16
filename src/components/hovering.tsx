import { hoveringType } from "../utils/types/state";
import { motion, AnimatePresence } from "framer-motion";
import { useMouse } from "../utils/hooks/useMouse";
import { useScreen } from "../utils/hooks/useScreen";
import { Text, Flex } from "@chakra-ui/react";

export default function Hovering(props: hoveringType) {
    const { mouse } = useMouse();
    const screen = useScreen();

    if (screen.width < 500) {
        // Don't show on mobile, can cause weird bugs
        return <></>;
    }

    return (
        <AnimatePresence>
            {props.hovering && (
                <motion.div
                    className={
                        "bg-MidGrey absolute w-fit h-fit pointer-events-none z-40 m-1 overflow-hidden whitespace-nowrap"
                    }
                    style={{
                        x: mouse.x,
                        y: mouse.y,
                        left: props.x === "right" ? 0 : undefined,
                        top: props.y === "bottom" ? 0 : undefined,
                        right: props.x === "left" ? screen.width : undefined,
                        bottom: props.y === "top" ? screen.height : undefined,
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <Flex bg={"MidGrey"} px={5} py={3} borderRadius={"lg"}>
                        {props.type === "text" && <Text>{props.text}</Text>}
                        {props.type === "component" && <>{props.component}</>}
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
