import { Center, Image, Text, Flex } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { profileHookType, setHoveringType } from "../../utils/types/state";
import { Dispatch, SetStateAction } from "react";
import { overlayStateType } from "../../utils/types/overlay";

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
            top={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={`${HU * 0.75}px`}
            boxShadow={"#000 2px 2px 10px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            cursor={"pointer"}
            flexDir={"column"}
            onMouseOver={() => {
                props.setHovering({
                    hovering: true,
                    type: "text",
                    text: props.profile.profile?.profile?.display_name
                        ? `Hi ${props.profile.profile.profile?.display_name}!`
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
            <Image
                src={
                    props.profile.profile?.profile?.image_url ?? "/unknown.png"
                }
                alt={
                    "Profile picture of " +
                    props.profile.profile?.profile?.display_name
                }
                width={props.info.dims.width}
                height={props.info.dims.height}
            />
        </Center>
    );
}
