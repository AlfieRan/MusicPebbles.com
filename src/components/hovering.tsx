import { hoveringType } from "../utils/types/state";
import { motion, AnimatePresence } from "framer-motion";
import { useMouse } from "../utils/hooks/useMouse";
import { useScreen } from "../utils/hooks/useScreen";
import { Text, Flex } from "@chakra-ui/react";

export default function Hovering(props: hoveringType) {
    const { mouse } = useMouse();
    const screen = useScreen();

    if (screen.width < screen.height) {
        // Don't show on mobile, can cause weird bugs
        return <></>;
    }

    return (
        <AnimatePresence>
            {props.hovering && (
                <motion.div
                    className={
                        "absolute w-fit h-fit pointer-events-none z-40 m-1 overflow-hidden whitespace-nowrap p-[2px] rounded-lg"
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
                    <Flex
                        className={"absolute inset-0 blur-sm"}
                        bg={"whiteAlpha.500"}
                        borderRadius={"lg"}
                    />
                    <Flex
                        bg={"MidGrey"}
                        pos={"relative"}
                        px={5}
                        py={3}
                        borderRadius={"lg"}
                        zIndex={1}
                    >
                        {props.type === "text" && (
                            <Flex
                                maxW={`${Math.min(screen.width * 0.9, 400)}px`}
                                minW={`${Math.min(
                                    400,
                                    props.text.length * 8
                                )}px`}
                            >
                                <Text
                                    fontSize={"md"}
                                    whiteSpace={"break-spaces"}
                                >
                                    {props.text}
                                </Text>
                            </Flex>
                        )}
                        {props.type === "component" && <>{props.component}</>}
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
