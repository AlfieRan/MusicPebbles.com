import { Box, Center, Text } from "@chakra-ui/react";
import Image from "next/image";
import { profile } from "../../utils/types/oauth";

export function Welcome(props: { profile: profile }) {
    return (
        <Center h={"full"} w={"full"} flexDir={"column"}>
            <Box borderRadius={"xl"} overflow={"hidden"}>
                <Image
                    src={props.profile.image_url}
                    alt={"Profile Picture of user"}
                    width={200}
                    height={200}
                />
            </Box>
            <Text my={5}>Welcome {props.profile.display_name}!</Text>
        </Center>
    );
}
