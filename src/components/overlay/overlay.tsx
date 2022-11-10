import { overlayStateType } from "../../utils/types/overlay";
import { AnimatePresence, motion } from "framer-motion";
import BlurredBackground from "./blurredBackground";

export function Overlay(props: { info: overlayStateType; hide: () => void }) {
    return (
        <>
            <AnimatePresence>
                <BlurredBackground
                    hidden={props.info.hidden}
                    hide={props.hide}
                />
                {!props.info.hidden && (
                    <motion.div
                        key={"overlayMain"}
                        className={"absolute z-50 w-fit h-fit"}
                        exit={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        props.info.component
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
