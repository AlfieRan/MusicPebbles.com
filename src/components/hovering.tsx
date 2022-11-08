import { hoveringType } from "../utils/types/state";
import { motion, AnimatePresence } from "framer-motion";
import { useMouse } from "../utils/hooks/useMouse";
import { useProfile } from "../utils/hooks/useProfile";
import { Flex, Text } from "@chakra-ui/react";
import { useUniqueness } from "../utils/hooks/useUniqueness";
import { useScreen } from "../utils/hooks/useScreen";
import { useCustomSummary } from "../utils/hooks/useCustomSummary";

export default function Hovering(props: { hoveringState: hoveringType }) {
    const { mouse, sector } = useMouse();
    const profile = useProfile();
    const screen = useScreen();
    const uniqueness = useUniqueness();
    const customHover = useCustomSummary();
    const showRanking =
        props.hoveringState.hovering &&
        props.hoveringState.type === "artist" &&
        props.hoveringState.artist.ranking !== undefined;

    if (screen.width < 500) {
        // Don't show on mobile, can cause weird bugs
        return <></>;
    }

    return (
        <AnimatePresence>
            {props.hoveringState.hovering && (
                <motion.div
                    className={
                        "bg-MidGrey absolute w-fit h-fit pointer-events-none z-40 m-1 overflow-hidden whitespace-nowrap"
                    }
                    style={{
                        x: mouse.x,
                        y: mouse.y,
                        left: sector.x === "left" ? 0 : undefined,
                        top: sector.y === "top" ? 0 : undefined,
                        right: sector.x === "right" ? screen.width : undefined,
                        bottom:
                            sector.y === "bottom" ? screen.height : undefined,
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    {props.hoveringState.type === "profile" && (
                        <Flex
                            bg={"MidGrey"}
                            top={-200}
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
                    )}
                    {props.hoveringState.type === "artist" && (
                        <Flex
                            bg={"MidGrey"}
                            top={-200}
                            m={1}
                            px={3}
                            py={1}
                            borderRadius={"xl"}
                            flexDir={"column"}
                            maxW={"450px"}
                        >
                            <Flex>
                                <Text hidden={!showRanking} mr={2}>
                                    {props.hoveringState.artist?.ranking ?? ""}.
                                </Text>
                                <Text>{props.hoveringState.artist?.name}</Text>
                            </Flex>
                            <Text fontSize={"sm"} opacity={0.65}>
                                {props.hoveringState.artist?.genres.length > 0
                                    ? props.hoveringState.artist?.genres
                                          .length > 1
                                        ? props.hoveringState.artist
                                              ?.genres[0] +
                                          " and " +
                                          (props.hoveringState.artist?.genres
                                              .length -
                                              1) +
                                          " more"
                                        : props.hoveringState.artist?.genres[0]
                                    : "No genres"}
                            </Text>
                            <Text fontSize={"sm"} opacity={0.65}>
                                {props.hoveringState.artist?.followers.total.toLocaleString()}{" "}
                                followers
                            </Text>
                            <Text fontSize={"sm"} opacity={0.65} mt={2}>
                                Click for more info.
                            </Text>
                        </Flex>
                    )}
                    {props.hoveringState.type === "niche" && (
                        <Flex
                            bg={"MidGrey"}
                            top={-200}
                            m={1}
                            px={3}
                            py={1}
                            borderRadius={"xl"}
                            flexDir={"column"}
                            maxW={"300px"}
                            minW={"250px"}
                            fontSize={"md"}
                            whiteSpace={"normal"}
                        >
                            <Text hidden={customHover === undefined}>
                                {customHover}
                            </Text>
                            <Text hidden={customHover !== undefined}>
                                {uniqueness.details}
                            </Text>
                        </Flex>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
