import { AnimatePresence, motion } from "framer-motion";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { setupKeyPresses } from "../../utils/usability";

export default function BlurredBackground(props: {
    hidden: boolean;
    hide: (value?: boolean) => void;
}) {
    useEffect(() => {
        return setupKeyPresses(() => props.hide(false));
    }, []);

    return (
        <AnimatePresence>
            {!props.hidden && (
                <motion.div
                    key={"overlayBlur"}
                    className={
                        "w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 fixed z-30"
                    }
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    initial={{ opacity: 1, backdropFilter: "blur(10px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                    transition={{ duration: 0.15 }}
                    onClick={() => props.hide(false)}
                >
                    <Flex
                        className={
                            " w-screen h-screen absolute top-0 left-0 z-30"
                        }
                        hidden={props.hidden}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
