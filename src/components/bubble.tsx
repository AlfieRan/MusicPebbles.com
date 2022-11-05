import { setHoveringType } from "../utils/types/state";
import { bubbleType } from "../utils/types/bubbles";
import { Center } from "@chakra-ui/react";
import { useProfile } from "../utils/hooks/useProfile";
import Image from "next/image";
import { artistType } from "../utils/types/spotify";

export function Bubble(props: {
    setHovering: setHoveringType;
    context: bubbleType;
    changeSettings?: () => void;
    changeArtist?: (artistInfo: artistType) => void;
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
                onClick={() => {
                    if (
                        props.changeArtist &&
                        props.context.details.type === "artist"
                    ) {
                        props.changeArtist(props.context.details.artist);
                    }
                }}
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

    const Margin = 4;
    return (
        <Center
            flexDir={"column"}
            borderRadius={"full"}
            position={"absolute"}
            top={props.context.physics.pos.y - props.context.physics.radius}
            left={props.context.physics.pos.x - props.context.physics.radius}
            zIndex={20}
            m={`${Margin}px`}
            w={`${diameter - Margin}px`}
            h={`${diameter - Margin}px`}
            minH={0}
            overflow={"hidden"}
            bg={"MidBlue"}
        >
            {middle}
        </Center>
    );
}
