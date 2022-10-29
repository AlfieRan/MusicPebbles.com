import { artistsType, artistType } from "../../utils/types/spotify";
import { Center, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { setHoveringType } from "../../utils/types/state";

export function ArtistBubble(props: {
    artist: artistType;
    key: string;
    setHovering: setHoveringType;
}) {
    return (
        <Center
            flexDir={"column"}
            borderRadius={"full"}
            m={2}
            w={"150px"}
            h={"150px"}
            minH={0}
            overflow={"hidden"}
            bg={"MidBlue"}
        >
            <Image
                src={props.artist.images[0].url}
                width={props.artist.images[0].width}
                height={props.artist.images[0].height}
                alt={"Profile Picture of " + props.artist.name}
                onMouseOver={() =>
                    props.setHovering({
                        hovering: true,
                        type: "artist",
                        artist: props.artist,
                    })
                }
                onMouseLeave={() => props.setHovering({ hovering: false })}
            />
        </Center>
    );
}

export function ArtistBubbleWrap(props: {
    artists: artistsType;
    setHovering: setHoveringType;
}) {
    return (
        <Flex
            w={"100%"}
            position={"relative"}
            mt={2}
            mb={10}
            justifyContent={"center"}
        >
            <Flex wrap={"wrap"} justifyContent={"center"}>
                {props.artists.map((artist) => (
                    <ArtistBubble
                        artist={artist}
                        key={artist.id}
                        setHovering={props.setHovering}
                    />
                ))}
            </Flex>
        </Flex>
    );
}
