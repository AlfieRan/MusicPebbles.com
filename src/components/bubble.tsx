import { setHoveringType } from "../utils/types/state";
import { bubbleType } from "../utils/types/bubbles";
import { Center, Text } from "@chakra-ui/react";
import { useProfile } from "../utils/hooks/useProfile";
import Image from "next/image";
import { artistType } from "../utils/types/spotify";
import { useUniqueness } from "../utils/hooks/useUniqueness";
import { pebblePadding } from "../utils/hooks/useBubbles";

export function Bubble(props: {
    setHovering: setHoveringType;
    context: bubbleType;
    changeSettings?: () => void;
    changeArtist?: (artistInfo: artistType) => void;
    changeNiche?: () => void;
}) {
    const profile = useProfile();
    const uniqueness = useUniqueness();
    let middle = <></>;

    if (props.context.details.type === "artist") {
        middle = (
            <Center
                w={props.context.physics.dimensions.width}
                h={props.context.physics.dimensions.height}
                p={`${pebblePadding}px`}
                onMouseOver={() => {
                    // have to do this cause weird typescript edge case
                    if ("artist" in props.context.details) {
                        props.setHovering({
                            hovering: true,
                            type: "artist",
                            artist: props.context.details.artist,
                        });
                    }
                }}
                onMouseLeave={() => props.setHovering({ hovering: false })}
                onClick={() => {
                    if (
                        props.changeArtist &&
                        props.context.details.type === "artist"
                    ) {
                        props.changeArtist(props.context.details.artist);
                    }
                }}
                key={props.context.details.artist.id + "pebbleImage"}
            >
                <Image
                    src={props.context.details.artist.images[0].url}
                    alt={
                        "Profile Picture of " +
                        props.context.details.artist.name
                    }
                    width={
                        props.context.physics.dimensions.width - pebblePadding
                    }
                    height={
                        props.context.physics.dimensions.height - pebblePadding
                    }
                />
            </Center>
        );
    } else if (props.context.details.type === "profile") {
        if (profile.profile?.image_url === undefined) {
            middle = (
                <Center
                    w={props.context.physics.dimensions.width}
                    h={props.context.physics.dimensions.height}
                    onMouseOver={() =>
                        props.setHovering({
                            hovering: true,
                            type: "profile",
                        })
                    }
                    onMouseLeave={() => props.setHovering({ hovering: false })}
                    onClick={() => props.changeSettings?.()}
                    bg={"green.300"}
                >
                    <Text
                        textAlign={"center"}
                        fontSize={"3xl"}
                        fontWeight={"bold"}
                    >
                        {profile.profile?.display_name ?? "Loading..."}
                    </Text>
                </Center>
            );
        } else {
            middle = (
                <Image
                    src={profile.profile?.image_url ?? ""}
                    width={props.context.physics.dimensions.width}
                    height={props.context.physics.dimensions.height}
                    alt={profile.profile?.display_name}
                    onMouseOver={() =>
                        props.setHovering({
                            hovering: true,
                            type: "profile",
                        })
                    }
                    onMouseLeave={() => props.setHovering({ hovering: false })}
                    onClick={() => props.changeSettings?.()}
                    priority
                />
            );
        }
    } else if (props.context.details.type === "niche") {
        middle = (
            <Center
                p={2}
                w={"full"}
                h={"full"}
                bg={"#2993D5"}
                onMouseOver={() => {
                    props.setHovering({
                        hovering: true,
                        type: "niche",
                    });
                }}
                onMouseLeave={() => props.setHovering({ hovering: false })}
                onClick={props.changeNiche}
            >
                <Text
                    textAlign={"center"}
                    fontWeight={"semibold"}
                    color={"white"}
                >
                    Uniqueness: {uniqueness.rating}/100
                </Text>
            </Center>
        );
    } else {
        console.log("Unknown bubble type attempted to be rendered.");
    }

    const Margin = 4;
    return (
        <Center
            flexDir={"column"}
            position={"absolute"}
            top={
                props.context.physics.pos.y -
                props.context.physics.dimensions.width / 2
            }
            left={
                props.context.physics.pos.x -
                props.context.physics.dimensions.height / 2
            }
            zIndex={20}
            m={`${Margin}px`}
            w={`${props.context.physics.dimensions.width}px`}
            h={`${props.context.physics.dimensions.height}px`}
            borderRadius={`${pebblePadding / 1.5}px`}
            bg={"MidBlue"}
            cursor={"pointer"}
        >
            {middle}
        </Center>
    );
}
