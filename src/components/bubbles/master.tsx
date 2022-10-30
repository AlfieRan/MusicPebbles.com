import { setHoveringType } from "../../utils/types/state";
import { bubbleType } from "../../utils/types/bubbles";
import { ArtistBubble } from "./artist";
import { ProfileBubble } from "./profile";

export function Bubble(props: {
    setHovering: setHoveringType;
    context: bubbleType;
}) {
    if (props.context.type === "artist") {
        return (
            <ArtistBubble
                context={props.context}
                key={props.context.artist.id}
                setHovering={props.setHovering}
            />
        );
    } else if (props.context.type === "profile") {
        return (
            <ProfileBubble
                context={props.context}
                key={"profile"}
                setHovering={props.setHovering}
            />
        );
    } else {
        console.log("Unknown bubble type attempted to be rendered");
        return <></>;
    }
}
