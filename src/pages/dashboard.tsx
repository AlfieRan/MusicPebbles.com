import { Box } from "@chakra-ui/react";
import { useProfile } from "../utils/hooks/useProfile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading } from "../components/dashboard/loading";
import { Main } from "../components/dashboard/main";
import { dashboardStateType } from "../utils/types/state";

const Page = () => {
    const profileState = useProfile();
    const router = useRouter();
    const [curComponent, setCurComponent] = useState<dashboardStateType>({
        type: "loading",
        component: <Loading />,
    });

    useEffect(() => {
        if (
            (profileState.error ||
                profileState.profile.profile === undefined) &&
            !profileState.loading
        ) {
            console.log("Redirecting to index, profile:", profileState);
            router.push("/").catch(console.error);
        } else if (profileState.profile && curComponent.type !== "main") {
            setCurComponent({
                type: "main",
                component: <Main />,
            });
        }
    }, [profileState]);

    return (
        <Box h={"100%"} w={"100%"} minH={0} overflow={"hidden"}>
            {curComponent.component}
        </Box>
    );
};

export default Page;
