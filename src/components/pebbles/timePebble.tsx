import { Button, Center, Text, Flex } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";
import { useEffect, useState } from "react";

export default function TimePebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    updateSongs: Function;
    updateArtists: Function;
}) {
    const timeOptions = [
        { info: "1 Month", type: "short_term" },
        { info: "6 Months", type: "medium_term" },
        { info: "All Time", type: "long_term" },
    ];
    const [timeSelected, setTimeSelected] = useState(timeOptions[1]);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/user/setTime", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ time: timeSelected.type }),
            });

            if (response.status === 200) {
                props.updateSongs();
                props.updateArtists();
            } else {
                console.log("Error setting time");
                // TODO: Handle error with a toast
            }
        })();
    }, [timeSelected]);

    return (
        <Center
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            bottom={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            _hover={{ bg: "blackAlpha.700" }}
            transition={"0.1s ease-in-out"}
        >
            <Flex
                flexDir={"column"}
                w={"100%"}
                h={"100%"}
                p={2}
                px={4}
                justifyContent={"center"}
            >
                {timeOptions.map((time) => (
                    <Button
                        key={time.type + " button"}
                        my={1}
                        bg={
                            timeSelected.type === time.type
                                ? "MidBlue"
                                : "MidGrey"
                        }
                        _hover={{ bg: "MidDarkBlue" }}
                        _active={{ bg: "DarkBlue" }}
                        onClick={() => setTimeSelected(time)}
                    >
                        <Text>{time.info}</Text>
                    </Button>
                ))}
            </Flex>
        </Center>
    );
}
