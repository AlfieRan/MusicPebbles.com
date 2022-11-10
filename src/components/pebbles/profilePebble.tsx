import { useProfile } from "../../utils/hooks/useProfile";
import { Center } from "@chakra-ui/react";
import Image from "next/image";
import { pebblePhysics } from "../../utils/types/pebbles";

export default function ProfilePebble(props: pebblePhysics) {
    const profile = useProfile();
    return (
        <Center
            w={`${props.dims.width}px`}
            h={`${props.dims.height}px`}
            bottom={`${props.pos.y}px`}
            left={`${props.pos.x}px`}
            borderRadius={"15px"}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"MidGrey"}
            pos={"absolute"}
        >
            <Image
                src={profile.profile?.image_url ?? ""}
                alt={"Profile picture of " + profile.profile?.display_name}
                width={props.dims.width}
                height={props.dims.height}
            />
        </Center>
    );
}
