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
        if (profileState.error) {
            router.push("/").catch(console.error);
        } else if (profileState.profile && curComponent.type !== "main") {
            setCurComponent({
                type: "main",
                component: <Main profile={profileState.profile} />,
            });
        }
    }, [profileState]);

    return (
        <Box
            h={"100%"}
            w={"100%"}
            minH={0}
            overflowY={"scroll"}
            overflowX={"hidden"}
        >
            {curComponent.component}
        </Box>
    );
};

export default Page;
