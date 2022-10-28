import { Center, Link } from "@chakra-ui/react";

export function Error() {
    return (
        <Center h={"full"} w={"full"} flexDir={"column"}>
            <Link href={"/"}>
                Something went wrong on our end, please try logging in again.
            </Link>
        </Center>
    );
}
