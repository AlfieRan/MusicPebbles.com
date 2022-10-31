import { Center } from "@chakra-ui/react";
import Image from "next/image";
import { setHoveringType } from "../../utils/types/state";
import { bubbleType } from "../../utils/types/bubbles";

export function ArtistBubble(props: {
    context: bubbleType;
    key: string;
    setHovering: setHoveringType;
}) {
    if (props.context.details.type !== "artist") {
        console.log("ArtistBubble was passed a non-artist bubble.");
        return <></>;
    }

    return (
        <Center
            flexDir={"column"}
            borderRadius={"full"}
            position={"absolute"}
            top={props.context.physics.pos.y - props.context.physics.radius}
            left={props.context.physics.pos.x - props.context.physics.radius}
            zIndex={10}
            m={2}
            w={`${props.context.physics.radius * 2}px`}
            h={`${props.context.physics.radius * 2}px`}
            minH={0}
            overflow={"hidden"}
            bg={"MidBlue"}
        >
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
        </Center>
    );
}
