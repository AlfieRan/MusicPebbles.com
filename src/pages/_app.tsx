import React from "react";
import { Flex } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import { extendTheme } from "@chakra-ui/react";
import "tailwindcss/tailwind.css";

const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                color: "#FFFFFF",
                bg: "DarkGrey",
                fontSize: ["sm", "md", "lg", "xl"],
                overscrollBehavior: "none",
            },
        },
    },
    colors: {
        white: "#FBFBFB",
        LightGrey: "#7a7a7a",
        MidGrey: "#282828",
        DarkGrey: "#161616",
        DarkBlue: "#1B263B",
        MidBlue: "#285883",
        LightBlue: "#3993DD",
        LightGreen: "#09BC8A",
        DarkGreen: "#2e602b",
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <header>
                <title>Bubbles</title>
            </header>
            <ChakraProvider theme={theme}>
                <Flex w={"100%"} h={"100vh"} flexGrow={1}>
                    <Component {...pageProps} />
                </Flex>
            </ChakraProvider>
        </>
    );
}
