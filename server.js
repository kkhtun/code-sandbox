// Imports
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const path = require("path");
const express = require("express");
const Joi = require("joi");
const app = express();
const DOCKER_CONTAINER = "sandbox:jlox";

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
                timeout: 10000,
            }
        );
        return res.status(200).send({
            stdout: stdout.split("\n"),
            stderr: stderr.split("\n"),
        });
    } catch (e) {
        console.error(`[ERROR] ${e.message}`); // should contain code (exit code) and signal (that caused the termination).
        console.error(e); // should contain code (exit code) and signal (that caused the termination).
        return res.status(500).send({
            code: e.code,
            message: e.message,
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
