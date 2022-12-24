import {
    Button,
    Flex,
    Link,
    Text,
    Grid,
    GridItem,
    Image,
    CircularProgress,
    CircularProgressLabel,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { profileHookType } from "../../utils/types/state";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ExitButton from "./utils/exitButton";
import {
    overlayStateType,
    profileOverlayButtonType,
} from "../../utils/types/overlay";
import { useScreen } from "../../utils/hooks/useScreen";
import { useUniquenessType } from "../../utils/hooks/useUniqueness";
import { imageType, timeFrameType } from "../../utils/types/spotify";
import { shortString } from "../../utils/other/basics";

// share overlay should be 9:16 aspect ratio for social media

export default function ShareOverlay(props: {
    profile: profileHookType;
    uniqueness: useUniquenessType;
    timeFrame: timeFrameType;
    exit: () => void;
}) {
    const screenHook = useScreen();
    const internalVerticalPadding = 0.4;
    const [sizes, setSizes] = useState<{ WU: number; HU: number }>(
        getSizes(screenHook)
    );
    const [Loading, setLoading] = useState(true);

    const [topArtistImage, setTopArtistImage] = useState<imageType>({
        width: 1,
        height: 1,
        url: "/unknown.png",
    });
    const [topArtists, setTopArtists] = useState<string[]>([]);

    const [topSongs, setTopSongs] = useState<string[]>([]);
    const [topSongImage, setTopSongImage] = useState<imageType>({
        width: 1,
        height: 1,
        url: "/unknown.png",
    });

    useEffect(() => {
        if (props.profile.profile.artists === undefined) {
            setLoading(true);
            return;
        }

        const artists = props.profile.profile.artists[props.timeFrame];

        if (artists === false) {
            setLoading(true);
            return;
        }

        if (artists.length > 0) {
            setTopArtistImage(
                artists[0].images.length > 0
                    ? artists[0].images[0]
                    : { width: 1, height: 1, url: "/unknown.png" }
            );
            setTopArtists(artists.map((artist) => artist.name).slice(0, 5));
        } else {
            setTopArtistImage({ width: 1, height: 1, url: "/unknown.png" });
        }
    }, [props.profile.profile.artists]);

    useEffect(() => {
        if (props.profile.profile.songs === undefined) {
            setLoading(true);
            return;
        }

        const songs = props.profile.profile.songs[props.timeFrame];

        if (songs === false) {
            setLoading(true);
            return;
        }

        if (songs.length > 0) {
            setTopSongImage(
                songs[0].album.images.length > 0
                    ? songs[0].album.images[0]
                    : { width: 1, height: 1, url: "/unknown.png" }
            );
            setTopSongs(songs.map((song) => song.name).slice(0, 5));
        } else {
            setTopSongImage({ width: 1, height: 1, url: "/unknown.png" });
        }
    }, [props.profile.profile.songs]);

    function getSizes(screenSize: { width: number; height: number }) {
        if (screenSize.width * 16 < screenSize.height * 9) {
            // mobile version
            return {
                WU: screenSize.width / 11,
                HU: screenSize.width * (16 / 99),
            };
        } else {
            // tablet + desktop version
            return {
                WU: screenSize.height * (9 / 176),
                HU: screenSize.height / 11,
            };
        }
    }

    useEffect(() => {
        setSizes(getSizes(screenHook));
    }, [screenHook]);

    return (
        <Flex
            bgGradient={"linear(to-br, MidBlue, MidGreen)"}
            borderRadius={`${sizes.WU * 0.15}px`}
            overflow={"hidden"}
            boxShadow={"#133 1px 2px 8px"}
        >
            <Flex
                flexDir={"column"}
                px={`${sizes.WU * 0.4}px`}
                py={`${sizes.WU * 0.35}px`}
                w={`${sizes.WU * 10}px`}
                h={`${sizes.HU * 10}px`}
                key={"ProfileOverlay"}
                justifyContent={"space-between"}
                bg={"blackAlpha.400"}
            >
                <Flex
                    w={`${sizes.WU * 9.2}px`}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Flex flexDir={"column"} w={`${sizes.WU * 6}px`}>
                        <Text
                            fontSize={`${sizes.WU * 0.6}px`}
                            fontWeight={"semibold"}
                            bg={"blackAlpha.300"}
                            px={`${sizes.WU * 0.15}px`}
                            py={`${sizes.WU * 0.1}px`}
                            borderRadius={`${sizes.WU * 0.2}px`}
                            boxShadow={"rgba(0,0,0,0.3) 2px 4px 8px"}
                        >
                            MusicPebbles.com
                        </Text>
                    </Flex>
                    <ExitButton
                        fn={props.exit}
                        size={Math.min(sizes.WU, sizes.HU)}
                    />
                </Flex>
                <Flex flexDir={"column"}>
                    <Flex
                        w={`${sizes.WU * 9.2}px`}
                        my={`${sizes.WU * internalVerticalPadding}px`}
                        alignItems={"center"}
                        flexDir={"row"}
                    >
                        <Flex
                            h={"fit-content"}
                            overflow={"hidden"}
                            borderRadius={`${sizes.WU * 0.1}px`}
                            minW={`${sizes.WU * 4}px`}
                            boxShadow={"rgba(0,0,0,0.3) 2px 4px 8px"}
                        >
                            <Image
                                src={topArtistImage.url}
                                alt={"Artist Image"}
                                width={topArtistImage.width * sizes.WU * 4}
                                height={topArtistImage.height * sizes.WU * 4}
                            />
                        </Flex>
                        <Flex
                            flexDir={"column"}
                            w={"100%"}
                            h={"100%"}
                            ml={`${sizes.WU * 0.3}px`}
                            justifyContent={"center"}
                            bg={"blackAlpha.500"}
                            px={`${sizes.WU * 0.15}px`}
                            py={`${sizes.WU * 0.1}px`}
                            borderRadius={`${sizes.WU * 0.2}px`}
                            boxShadow={"#333 2px 4px 8px"}
                        >
                            <Text
                                fontSize={`${sizes.WU * 0.5}px`}
                                fontWeight={"semibold"}
                            >
                                Top Artists
                            </Text>
                            {topArtists.map((artist, index) => (
                                <Text
                                    key={index}
                                    fontSize={`${sizes.WU * 0.4}px`}
                                >
                                    {index + 1}. {shortString(artist, 20)}
                                </Text>
                            ))}
                        </Flex>
                    </Flex>
                    <Flex
                        w={`${sizes.WU * 9.2}px`}
                        my={`${sizes.WU * internalVerticalPadding}px`}
                        alignItems={"center"}
                        flexDir={"row"}
                    >
                        <Flex
                            flexDir={"column"}
                            w={"100%"}
                            h={"100%"}
                            mr={`${sizes.WU * 0.3}px`}
                            justifyContent={"center"}
                            bg={"blackAlpha.500"}
                            px={`${sizes.WU * 0.15}px`}
                            py={`${sizes.WU * 0.1}px`}
                            borderRadius={`${sizes.WU * 0.2}px`}
                            boxShadow={"#333 2px 4px 8px"}
                        >
                            <Text
                                fontSize={`${sizes.WU * 0.5}px`}
                                fontWeight={"semibold"}
                            >
                                Top Songs
                            </Text>
                            {topSongs.map((song, index) => (
                                <Text
                                    key={index}
                                    fontSize={`${sizes.WU * 0.37}px`}
                                >
                                    {index + 1}. {shortString(song, 20)}
                                </Text>
                            ))}
                        </Flex>
                        <Flex
                            h={"fit-content"}
                            overflow={"hidden"}
                            borderRadius={`${sizes.WU * 0.1}px`}
                            minW={`${sizes.WU * 4}px`}
                            boxShadow={"rgba(0,0,0,0.3) 2px 4px 8px"}
                        >
                            <Image
                                src={topSongImage.url}
                                alt={"Artist Image"}
                                width={topSongImage.width * sizes.WU * 4}
                                height={topSongImage.height * sizes.WU * 4}
                            />
                        </Flex>
                    </Flex>
                    <Flex
                        w={`${sizes.WU * 9.2}px`}
                        my={`${sizes.WU * internalVerticalPadding}px`}
                        bg={"blackAlpha.500"}
                        px={`${sizes.WU * 0.15}px`}
                        py={`${sizes.WU * 0.1}px`}
                        borderRadius={`${sizes.WU * 0.2}px`}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        flexDir={"row"}
                        boxShadow={"#333 2px 4px 8px"}
                    >
                        <Flex
                            w={`${sizes.WU * 2.3}px`}
                            fontSize={`${sizes.WU * 3.5}px`}
                        >
                            <CircularProgress
                                value={
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .rating
                                }
                                color={
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .colour
                                }
                                trackColor={"whiteAlpha.400"}
                                size={"full"}
                                thickness={`${sizes.WU * 0.2}px`}
                                transition={"all 0.01s ease-in-out"}
                            >
                                <CircularProgressLabel>
                                    {
                                        props.uniqueness.uniqueness[
                                            props.timeFrame
                                        ].rating
                                    }
                                </CircularProgressLabel>
                            </CircularProgress>
                        </Flex>
                        <Flex flexDir={"column"} w={`${sizes.WU * 6.45}px`}>
                            <Text fontSize={`${sizes.WU * 0.36}px`}>
                                {
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .details
                                }
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex
                    w={`${sizes.WU * 9.2}px`}
                    alignItems={"center"}
                    flexDir={"row"}
                >
                    <Flex
                        h={"fit-content"}
                        overflow={"hidden"}
                        borderRadius={`${sizes.WU * 0.1}px`}
                        minW={`${sizes.WU * 2}px`}
                        boxShadow={"#333 2px 4px 8px"}
                    >
                        <Image
                            src={
                                props.profile.profile.profile?.image_url ??
                                "/unknown.png"
                            }
                            alt={"Artist Image"}
                            width={topSongImage.width * sizes.WU * 2}
                            height={topSongImage.height * sizes.WU * 2}
                        />
                    </Flex>
                    <Flex
                        flexDir={"column"}
                        w={"100%"}
                        ml={`${sizes.WU * 0.3}px`}
                        justifyContent={"flex-end"}
                    >
                        <Text
                            fontSize={`${sizes.WU * 0.7}px`}
                            fontWeight={"semibold"}
                            textAlign={"left"}
                        >
                            {props.profile.profile.profile?.display_name ??
                                "unknown"}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
