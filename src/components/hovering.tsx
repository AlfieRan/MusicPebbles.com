import { hoveringType } from "../utils/types/state";
import { motion, AnimatePresence } from "framer-motion";
import { useMouse } from "../utils/hooks/useMouse";
import { useProfile } from "../utils/hooks/useProfile";
import { Flex, Text } from "@chakra-ui/react";

export default function Hovering(props: { hoveringState: hoveringType }) {
    const mouse = useMouse();
    const profile = useProfile();

    return (
        <AnimatePresence>
            {props.hoveringState.hovering && (
                <motion.div
                    className={
                        "bg-MidGrey top-0 left-0 absolute w-fit h-fit pointer-events-none z-50"
                    }
                    style={{
                        x: mouse.x,
                        y: mouse.y,
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <Flex
                        bg={"MidGrey"}
                        m={1}
                        px={3}
                        py={1}
                        borderRadius={"xl"}
                        flexDir={"column"}
                    >
                        <Text>Hi {profile.profile?.display_name}</Text>
                        <Text fontSize={"sm"} opacity={0.65}>
                            Click here to view settings
                        </Text>
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
