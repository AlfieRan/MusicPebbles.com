import { setHoveringType } from "../utils/types/state";
import { bubbleType } from "../utils/types/bubbles";
import { Center } from "@chakra-ui/react";
import { useProfile } from "../utils/hooks/useProfile";
import Image from "next/image";

export function Bubble(props: {
    setHovering: setHoveringType;
    context: bubbleType;
    changeSettings?: () => void;
}) {
    const profile = useProfile();
    const diameter = props.context.physics.radius * 2;
    const artistRating =
        props.context.details.type === "artist"
            ? props.context.details.artist.ranking
            : undefined;
    let middle = <></>;

    if (props.context.details.type === "artist") {
        middle = (
            <Image
                src={props.context.details.artist.images[0].url}
                width={props.context.details.artist.images[0].width}
                height={props.context.details.artist.images[0].height}
                alt={"Profile Picture of " + props.context.details.artist.name}
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
            />
        );
    } else if (props.context.details.type === "profile") {
        middle = (
            <Image
                src={profile.profile?.image_url ?? ""}
                width={diameter}
                height={diameter}
                alt={"Profile Picture of " + profile.profile?.display_name}
                onMouseOver={() =>
                    props.setHovering({
                        hovering: true,
                        type: "profile",
                    })
                }
                onMouseLeave={() => props.setHovering({ hovering: false })}
                onClick={() => props.changeSettings?.()}
            />
        );
    } else {
        console.log("Unknown bubble type attempted to be rendered.");
    }

    return (
        <Center
            flexDir={"column"}
            borderRadius={"full"}
            position={"absolute"}
            borderWidth={artistRating === undefined || artistRating > 3 ? 0 : 3}
            borderColor={
                artistRating === 1
                    ? "#FFD700"
                    : artistRating === 2
                    ? "#C0C0C0"
                    : artistRating === 3
                    ? "#CD7F32"
                    : "transparent"
            }
            top={props.context.physics.pos.y - props.context.physics.radius}
            left={props.context.physics.pos.x - props.context.physics.radius}
            zIndex={20}
            w={`${diameter}px`}
            h={`${diameter}px`}
            minH={0}
            overflow={"hidden"}
            bg={"MidBlue"}
        >
            {middle}
        </Center>
    );
}
