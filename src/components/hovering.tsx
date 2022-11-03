import { hoveringType } from "../utils/types/state";
import { motion, AnimatePresence } from "framer-motion";
import { useMouse } from "../utils/hooks/useMouse";
import { useProfile } from "../utils/hooks/useProfile";
import { Flex, Text } from "@chakra-ui/react";

export default function Hovering(props: { hoveringState: hoveringType }) {
    const mouse = useMouse();
    const profile = useProfile();
    const showRanking =
        props.hoveringState.hovering &&
        props.hoveringState.type === "artist" &&
        props.hoveringState.artist.ranking !== undefined;

    return (
        <AnimatePresence>
            {props.hoveringState.hovering && (
                <motion.div
                    className={
                        "bg-MidGrey absolute w-fit h-fit pointer-events-none z-40 overflow-hidden"
                    }
                    style={{
                        x: mouse.x,
                        y: mouse.y,
                        left: 0,
                        top: 0,
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
                        </Flex>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
