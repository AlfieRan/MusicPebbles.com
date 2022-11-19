import React from "react";
import { Flex } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import { extendTheme } from "@chakra-ui/react";
import "tailwindcss/tailwind.css";
import { Analytics } from "@vercel/analytics/react";

const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                color: "#FFFFFF",
                bg: "LightGrey",
                fontSize: ["sm", "md", "lg", "xl"],
                overscrollBehavior: "none",
            },
        },
    },
    colors: {
        white: "#FBFBFB",
        LightGrey: "#5b5b5b",
        MidGrey: "#282828",
        DarkGrey: "#161616",
        DarkBlue: "#1B263B",
        MidDarkBlue: "#1f375d",
        MidBlue: "#285883",
        LightBlue: "#3993DD",
        LightGreen: "#09BC8A",
        MidGreen: "#0E6655",
        DarkGreen: "#2e602b",
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <header>
                <title>Pebbles</title>
            </header>
            <ChakraProvider theme={theme}>
                <Flex
                    w={"100%"}
                    h={"100vh"}
                    overflow={"hidden"}
                    minH={0}
                    bgGradient={"linear(to-br, MidBlue, MidGreen)"}
                >
                    <Component {...pageProps} />
                </Flex>
            </ChakraProvider>
            <Analytics />
        </>
    );
}
