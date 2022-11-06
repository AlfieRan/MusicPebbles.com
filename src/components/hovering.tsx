import { hoveringType } from "../utils/types/state";
import { motion, AnimatePresence } from "framer-motion";
import { useMouse } from "../utils/hooks/useMouse";
import { useProfile } from "../utils/hooks/useProfile";
import { Flex, Text } from "@chakra-ui/react";
import { useUniqueness } from "../utils/hooks/useUniqueness";

export default function Hovering(props: { hoveringState: hoveringType }) {
    const mouse = useMouse();
    const profile = useProfile();
    const uniqueness = useUniqueness();
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
                            maxW={"400px"}
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
                            fontSize={"md"}
                        >
                            <Text>
                                {uniqueness.rating >= 80
                                    ? "Do you only listen to artists who live in caves? Your taste is way too underground for any normal person, please just go outside."
                                    : uniqueness.rating >= 60
                                    ? "Your taste is pretty underground, but you're not too far gone. Stay off reddit and you might be somewhat tolerable."
                                    : uniqueness.rating >= 40
                                    ? "Your taste is pretty mainstream, but you also appreciate some smaller artists. You may not be normal in many ways but at least your music taste is."
                                    : uniqueness.rating >= 20
                                    ? "Do you only listen to artists who live in mansions? Your taste is very mainstream, try listening to something different once in a while."
                                    : "Your taste is so mainstream that it's almost underground. You're definitely a lizard pretending to be a person. (Hi Zuck!)"}
                            </Text>
                        </Flex>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
