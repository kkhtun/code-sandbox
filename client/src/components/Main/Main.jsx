import { useEffect, useRef, useState } from "react";
import {
    Grid,
    Typography,
    Paper,
    Box,
    Button,
    Divider,
    Alert,
    CircularProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Editor
import Editor from "@monaco-editor/react";
import { environment } from "../../environment";

const styles = {
    spacingSm: 2,
    spacingMd: 4,
    editorHeight: "500px",
};

const ERROR = {
    INVALID_RESPONSE: "Invalid Response",
};

function Main() {
    const defaultValue = "// some comment";
    const [code, setCode] = useState(defaultValue);
    const [error, setError] = useState("");
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    // Scrolling
    const scrollRef = useRef(null);
    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [output]);

    function onChange(value) {
        setCode(value);
    }

    async function onRun() {
        if (!code || typeof code !== "string")
            return setError("Please provide a valid input.");
        try {
            setIsRunning(true);
            const response = await fetch(`${environment.url}/run`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await response.json();
            if (!data || typeof data !== "object")
                throw new Error(ERROR.INVALID_RESPONSE);
            if (response.status < 200 || response.status > 204) {
                throw new Error(data.message);
            }
            const { stderr, stdout } = data;
            if (stderr && stderr.length > 1) {
                return setOutput(stderr);
            }
            if (stdout && stdout.length > 1) {
                return setOutput(stdout);
            }
            throw new Error(ERROR.INVALID_RESPONSE);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setIsRunning(false);
        }
    }

    return (
        <Box sx={{ padding: styles.spacingSm }}>
            <Box sx={{ marginBottom: styles.spacingSm }}>
                <Paper elevation={3} sx={{ padding: styles.spacingSm }}>
                    <Typography variant="h5">Lox Code Sandbox</Typography>
                </Paper>
            </Box>
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    sx={{ height: styles.editorHeight }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: styles.spacingSm,
                            height: "100%",
                        }}
                    >
                        <Editor
                            defaultValue={defaultValue}
                            onChange={onChange}
                            value={code}
                            theme="vs-dark"
                        />
                    </Paper>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    sx={{ height: styles.editorHeight }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: styles.spacingSm,
                                marginBottom: styles.spacingSm,
                                display: "flex",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="success"
                                disabled={isRunning}
                                endIcon={
                                    isRunning ? (
                                        <CircularProgress
                                            size="1rem"
                                            sx={{ color: "black" }}
                                            px={1}
                                        />
                                    ) : (
                                        <PlayArrowIcon />
                                    )
                                }
                                onClick={() => onRun()}
                            >
                                Run
                            </Button>
                            {error ? (
                                <Alert
                                    severity="error"
                                    sx={{ marginLeft: styles.spacingSm }}
                                >
                                    {error}
                                </Alert>
                            ) : (
                                <></>
                            )}
                        </Paper>

                        <Paper
                            variant="outlined"
                            sx={{
                                padding: styles.spacingSm,
                                overflow: "scroll",
                                height: "100%",
                            }}
                        >
                            <Typography>Output</Typography>
                            <Divider sx={{ marginBottom: styles.spacingSm }} />
                            {output.length > 0 ? (
                                output.map((line, idx) => {
                                    return (
                                        <Typography key={idx}>
                                            &gt; {line}
                                        </Typography>
                                    );
                                })
                            ) : (
                                <Typography>&gt;</Typography>
                            )}
                            <div ref={scrollRef}></div>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Main;
