import { Center } from "@chakra-ui/react";
import Image from "next/image";
import { setHoveringType } from "../../utils/types/state";
import { artistBubbleType } from "../../utils/types/bubbles";

export function ArtistBubble(props: {
    context: artistBubbleType;
    key: string;
    setHovering: setHoveringType;
}) {
    return (
        <Center
            flexDir={"column"}
            borderRadius={"full"}
            position={"absolute"}
            top={props.context.pos.y - props.context.radius}
            left={props.context.pos.x - props.context.radius}
            zIndex={10}
            m={2}
            w={`${props.context.radius * 2}px`}
            h={`${props.context.radius * 2}px`}
            minH={0}
            overflow={"hidden"}
            bg={"MidBlue"}
        >
            <Image
                src={props.context.artist.images[0].url}
                width={props.context.artist.images[0].width}
                height={props.context.artist.images[0].height}
                alt={"Profile Picture of " + props.context.artist.name}
                onMouseOver={() =>
                    props.setHovering({
                        hovering: true,
                        type: "artist",
                        artist: props.context.artist,
                    })
                }
                onMouseLeave={() => props.setHovering({ hovering: false })}
            />
        </Center>
    );
}
