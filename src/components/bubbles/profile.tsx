import { setHoveringType } from "../../utils/types/state";
import { Center } from "@chakra-ui/react";
import Image from "next/image";
import { bubbleType } from "../../utils/types/bubbles";
import { useProfile } from "../../utils/hooks/useProfile";

export function ProfileBubble(props: {
    setHovering: setHoveringType;
    context: bubbleType;
    changeSettings?: () => void;
}) {
    const profile = useProfile();
    const diameter = props.context.physics.radius * 2;
    return (
        <Center
            flexDir={"column"}
            borderRadius={"full"}
            position={"absolute"}
            top={props.context.physics.pos.y - props.context.physics.radius}
            left={props.context.physics.pos.x - props.context.physics.radius}
            zIndex={20}
            m={2}
            w={`${diameter}px`}
            h={`${diameter}px`}
            minH={0}
            overflow={"hidden"}
            bg={"MidBlue"}
        >
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
        </Center>
    );
}
