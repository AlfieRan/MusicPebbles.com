import { Text, Flex, Center, Button } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useProfile } from "../utils/hooks/useProfile";
import { useMouse } from "../utils/hooks/useMouse";
import { useScreen } from "../utils/hooks/useScreen";

export default function Tutorial(props: { hidden: boolean; skip: () => void }) {
    const profile = useProfile();
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [showHovering, setShowHovering] = useState<boolean>(false);

    function incrementSlideIndex() {
        setSlideIndex(slideIndex + 1);
    }

    useEffect(() => {
        setShowHovering(false);
    }, [showOverlay]);

    useEffect(() => {
        console.log("slideIndex: " + slideIndex);
    }, [slideIndex]);

    // TODO: add a slide about the pebbles scaling with popularity

    return (
        <AnimatePresence>
            {!props.hidden && (
                <motion.div
                    key={"tutorialBlur"}
                    className={
                        "w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 fixed z-30"
                    }
                    exit={{
                        opacity: 0,
                        backdropFilter: "blur(0px)",
                        transition: { delay: 0.2 },
                    }}
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{
                        opacity: 1,
                        backdropFilter: "blur(15px)",
                        transition: { delay: 2.5 },
                    }}
                    transition={{ duration: 0.25 }}
                >
                    <Flex
                        className={
                            " w-screen h-screen absolute top-0 left-0 z-30"
                        }
                        hidden={props.hidden}
                    />
                </motion.div>
            )}
            {!props.hidden && slideIndex === 0 && (
                <motion.div
                    key={"tutorialSlide1"}
                    className={"absolute z-50 w-fit h-fit"}
                    exit={{ scale: 0, opacity: 0, transition: { delay: 0 } }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { delay: 2.7 },
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <Center
                        key={"tutorialSlide1"}
                        flexDir={"column"}
                        minW={"350px"}
                        minH={"350px"}
                        overflow={"hidden"}
                    >
                        <Text mb={2} fontSize={"2xl"} textAlign={"center"}>
                            Welcome to Pebbles {profile.profile?.display_name}!
                        </Text>
                        <Flex
                            flexDir={"row"}
                            w={"full"}
                            justifyContent={"space-around"}
                        >
                            <Center
                                w={"150px"}
                                h={"150px"}
                                borderRadius={"full"}
                                overflow={"hidden"}
                                transform={"scale(0.95)"}
                                _hover={{ transform: "scale(1.0)" }}
                                _active={{ transform: "scale(0.90)" }}
                                transition={"transform 0.1s"}
                            >
                                <Button
                                    onClick={incrementSlideIndex}
                                    w={"full"}
                                    h={"full"}
                                    bg={"blue.400"}
                                    _hover={{ bg: "blue.500" }}
                                    _active={{ bg: "blue.600" }}
                                >
                                    <Text>Get started?</Text>
                                </Button>
                            </Center>
                            <Center
                                w={"150px"}
                                h={"150px"}
                                borderRadius={"full"}
                                overflow={"hidden"}
                                transform={"scale(0.95)"}
                                _hover={{ transform: "scale(1.0)" }}
                                _active={{ transform: "scale(0.90)" }}
                                transition={"transform 0.1s"}
                            >
                                <Button
                                    onClick={props.skip}
                                    w={"full"}
                                    h={"full"}
                                    bg={"blue.400"}
                                    _hover={{ bg: "blue.500" }}
                                    _active={{ bg: "blue.600" }}
                                >
                                    <Text>Skip tutorial?</Text>
                                </Button>
                            </Center>
                        </Flex>
                    </Center>
                </motion.div>
            )}
            {!props.hidden && slideIndex === 1 && !showOverlay && (
                <motion.div
                    key={"tutorialSlide2"}
                    className={"absolute z-50 w-fit h-fit"}
                    exit={{ scale: 0, opacity: 0, transition: { delay: 0 } }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { delay: 0.1 },
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <Center
                        key={"tutorialSlide1"}
                        flexDir={{ base: "column", md: "row" }}
                        minW={"350px"}
                        minH={"350px"}
                        overflow={"hidden"}
                    >
                        <Center
                            bg={"green.600"}
                            w={"200px"}
                            h={"200px"}
                            borderRadius={"full"}
                            m={2}
                            cursor={"pointer"}
                            onClick={() => setShowOverlay(true)}
                            onMouseOver={() => setShowHovering(true)}
                            onMouseLeave={() => setShowHovering(false)}
                        >
                            This is a bubble!
                        </Center>
                        <Flex
                            flexDir={"column"}
                            bg={"DarkGrey"}
                            maxW={"450px"}
                            textAlign={"center"}
                            px={3}
                            py={2}
                            borderRadius={"md"}
                            fontSize={"lg"}
                        >
                            <Text fontWeight={"semibold"} mb={2}>
                                Anything that looks like this can be interacted
                                with!
                            </Text>
                            <Text fontSize={"sm"} my={1}>
                                You can click on it to see more information
                            </Text>
                            <Text fontSize={"sm"} my={1}>
                                If you&apos;re on desktop you can also hover
                                over it to see a summary.
                            </Text>
                            <Text fontSize={"sm"} my={1}>
                                If you&apos;re on a large tablet you might also
                                see it since it is based upon screen size.
                            </Text>
                            <Button
                                bg={""}
                                borderWidth={2}
                                mt={3}
                                _hover={{ transform: "scale(1.03)" }}
                                _active={{ transform: "scale(0.97)" }}
                                onClick={props.skip}
                            >
                                Start using Pebbles
                            </Button>
                        </Flex>
                    </Center>
                </motion.div>
            )}
            {!props.hidden && slideIndex === 1 && showOverlay && (
                <motion.div
                    key={"tutorialSlide1Overlay"}
                    className={"absolute z-50 w-fit h-fit"}
                    exit={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <Center
                        bg={"MidGrey"}
                        borderRadius={"lg"}
                        borderWidth={2}
                        flexDir={"column"}
                        overflow={"hidden"}
                        p={2}
                    >
                        <Flex
                            w={"full"}
                            justifyContent={"space-between"}
                            maxW={"400px"}
                            maxH={"400px"}
                            mb={2}
                        >
                            <Text alignSelf={"center"}>Tutorial Bubble</Text>
                            <Button
                                scale={0.9}
                                bg={"blackAlpha.400"}
                                _hover={{
                                    bg: "blackAlpha.600",
                                    transform: "scale(1.05)",
                                }}
                                _active={{
                                    bg: "blackAlpha.800",
                                    transform: "scale(0.95)",
                                }}
                                transition={"all 0.15s ease-in-out"}
                                onClick={() => {
                                    setShowOverlay(false);
                                }}
                            >
                                X
                            </Button>
                        </Flex>
                        <Flex
                            flexDir={"column"}
                            maxW={"400px"}
                            maxH={"400px"}
                            fontSize={"sm"}
                            m={1}
                        >
                            <Text mb={1}>
                                If this was an artist bubble you&apos;d see a
                                picture of them along with some additional
                                information.
                            </Text>
                            <Text my={1}>
                                If it was your profile bubble you&apos;d see
                                your settings and profile information.
                            </Text>
                            <Text mt={1}>
                                If it was a special bubble, such as the
                                uniqueness bubble, you&apos;d see some other
                                interesting information.
                            </Text>
                        </Flex>
                    </Center>
                </motion.div>
            )}
            <HoverTutorial hidden={!showHovering} />
        </AnimatePresence>
    );
}

function HoverTutorial(props: { hidden: boolean }) {
    const { mouse } = useMouse();
    const profile = useProfile();
    const screen = useScreen();

    if (screen.width < 500) return <></>;

    return (
        <AnimatePresence>
            {!props.hidden && (
                <motion.div
                    className={
                        "bg-MidGrey absolute w-fit h-fit pointer-events-none z-50 m-1 overflow-hidden whitespace-nowrap"
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
                            This is a hover tutorial, it&apos;s here to help
                            you!
                        </Text>
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
