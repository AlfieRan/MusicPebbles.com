import { Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";
import { Dispatch, SetStateAction } from "react";
import { overlayStateType } from "../../utils/types/overlay";
import { profileHookType } from "../../utils/types/oauth";

export default function ProfilePebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    setOverlay: Dispatch<SetStateAction<overlayStateType>>;
    profile: profileHookType;
}) {
    function openSongOverlay() {
        props.setOverlay({
            hidden: false,
            type: "profile",
        });
        console.log("open song overlay");
    }

    const HU = props.info.dims.height / 10; // Height Unit
    const WU = props.info.dims.width / 10; // Width Unit

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
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            onMouseOver={() => {
                props.setHovering({
                    hovering: true,
                    type: "text",
                    text: props.profile.profile?.display_name
                        ? `Hi ${props.profile.profile?.display_name}!`
                        : "Loading...",
                    x: "right",
                    y: "top",
                });
            }}
            onMouseOut={() => {
                props.setHovering({ hovering: false });
            }}
            onClick={openSongOverlay}
        >
            <Flex pos={"absolute"} bottom={0}>
                <Text
                    h={`${HU * 0.6}px`}
                    w={`${WU * 9}px`}
                    fontSize={`${HU * 0.6}px`}
                    fontWeight={"semibold"}
                    color={"white"}
                    textAlign={"center"}
                    mb={`${HU * 0.3}px`}
                >
                    Click for Settings
                </Text>
            </Flex>
            <Image
                src={props.profile.profile?.image_url ?? "/unknown.png"}
                alt={
                    "Profile picture of " + props.profile.profile?.display_name
                }
                width={props.info.dims.width}
                height={props.info.dims.height}
            />
        </Center>
    );
}
