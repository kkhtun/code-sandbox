// Imports
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const path = require("path");
const nodeCron = require("node-cron");
const express = require("express");
const Joi = require("joi");
const moment = require("moment");
const app = express();
const DOCKER_CONTAINER = "sandbox:jlox";
const TIMEOUT_SECONDS = 10;

// Middlewares
app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/client/dist"));

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Register routes
app.post("/run", async (req, res) => {
    const schema = Joi.object({
        code: Joi.string().required(),
    });

    try {
        const { value, error } = schema.validate(req.body);
        if (error) throw new Error(error.details[0].message);

        // Spawn a temporary docker container inside child process and execute jlox code
        const { stdout, stderr } = await exec(
            // Please note that '' after echo to protect against manipuation by user-input
            `echo '${value.code}' | docker run --runtime=runsc --rm -i ${DOCKER_CONTAINER}`,
            {
                timeout: TIMEOUT_SECONDS * 1000,
            }
        );
        return res.status(200).send({
            stdout: stdout.split("\n"),
            stderr: stderr.split("\n"),
        });
    } catch (e) {
        console.error(`[ERROR] ${e.message}`); // should contain code (exit code) and signal (that caused the termination).
        console.error(e); // should contain code (exit code) and signal (that caused the termination).

        const message =
            e.signal === "SIGTERM"
                ? "Runtime Exceeded, please provide an easier case!"
                : "Internal Server Error";

        return res.status(500).send({
            code: 500,
            message,
        });
    }
});

// Spin up server
(async function main() {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server listening at port ${port}`);
    });
})();

nodeCron.schedule("*/5 * * * * *", async function removeOldContainers() {
    console.log("[CRON] Removing old containers");
    const { stdout } = await exec("docker ps --format json");
    const containers = stdout
        .split("\n")
        .filter((data) => !!data)
        .map(JSON.parse);
    const currentComputationTime = moment().utc();
    const promises = containers.map(async (container) => {
        const { CreatedAt, ID } = container;
        try {
            // moment complains with non-RFC2822 formats so I had to convert to nativeJS Date first
            const nativeDateObject = new Date(CreatedAt);
            const createdDate = moment(nativeDateObject).utc();
            if (
                currentComputationTime.diff(createdDate, "seconds") >
                TIMEOUT_SECONDS
            ) {
                await exec(`docker stop ${ID}`);
            }
        } catch (error) {
            console.log(error.message);
        }
        return `Container ${ID} stopped`;
    });
    await Promise.all(promises);
});
