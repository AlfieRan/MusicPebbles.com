import { setHoveringType } from "../../utils/types/state";
import { bubbleType } from "../../utils/types/bubbles";
import { ArtistBubble } from "./artist";
import { ProfileBubble } from "./profile";

export function Bubble(props: {
    setHovering: setHoveringType;
    context: bubbleType;
    changeSettings?: () => void;
}) {
    if (props.context.details.type === "artist") {
        return (
            <ArtistBubble
                context={props.context}
                key={props.context.details.artist.id}
                setHovering={props.setHovering}
            />
        );
    } else if (props.context.details.type === "profile") {
        return (
            <ProfileBubble
                context={props.context}
                key={"profile"}
                setHovering={props.setHovering}
                changeSettings={props.changeSettings}
            />
        );
    } else {
        console.log("Unknown bubble type attempted to be rendered.");
        return <></>;
    }
}
