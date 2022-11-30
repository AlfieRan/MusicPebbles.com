import { Center, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Pebbles from "../pebbles/Pebbles";

export function Main() {
    return (
        <Center
            h={"full"}
            w={"full"}
            flexDir={"column"}
            overflow={"hidden"}
            maxW={"100vw"}
            maxH={"100vh"}
        >
            <Flex
                pos={"absolute"}
                overflow={"hidden"}
                w={"full"}
                h={"full"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <motion.div
                    className={
                        "flex absolute overflow-hidden border-white bg-gray-600 h-96 w-96 justify-center items-center"
                    }
                    animate={{
                        scale: [5, 1.3, 1.5, 1.5, 0],
                        borderRadius: ["0%", "0%", "50%", "50%", "50%"],
                        borderWidth: ["0px", "1px", "2px", "1px", "1px"],
                        background: [
                            "#161616",
                            "#161616",
                            "#4b5563",
                            "#4b5563",
                            "#4b5563",
                        ],
                    }}
                    transition={{
                        duration: 4,
                        delay: 0.5,
                        ease: "easeInOut",
                        times: [0, 0.3, 0.4, 1],
                        borderWidth: {
                            duration: 0.1,
                        },
                    }}
                    initial={{ borderRadius: "0%" }}
                >
                    <Text>Pebbles</Text>
                </motion.div>
            </Flex>
            <motion.div
                className={"flex w-fit h-fit justify-center items-center z-1"}
                animate={{
                    scale: [0, 1.05, 1],
                    opacity: [0, 1, 1],
                }}
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                    times: [0, 0.6, 1],
                    delay: 3,
                }}
            >
                <Pebbles />
            </motion.div>
        </Center>
    );
}
