# Introduction

Implementation of a secure, scalable, code sandbox environment with backend support for hobby programming languages.

# Notes

Please make sure that binaries in both jlox and sandbox folders are update-to-date and recompiled for new systems before building a docker image. Re-build can be done using build\_\*.sh scripts (tested on Ubuntu 20.04)

Also, please make sure that "runsc" is registered as one of the possible runtimes for docker by checking the
file /etc/docker/daemon.json (please create if it does not exist).

# Necessary dependencies

-   A linux environment with gcc installed
-   OpenJDK 17+ (GraalVM preferred)
-   GraalVM with native-image and associated dependencies (https://www.graalvm.org/)
-   Docker
-   gVisor for runsc runtime (https://gvisor.dev/docs/user_guide/install/)
-   NodeJS (to serve as a backend for code sandbox, please see package.json for more)

# References

https://craftinginterpreters.com/
https://dev.to/narasimha1997/building-a-secure-sandboxed-environment-for-executing-untrusted-code-7e8
https://www.graalvm.org/22.0/reference-manual/native-image/StaticImages/

# A few helper scripts

To explore docker file system from interactive shell
docker run -it --entrypoint sh image_name:tag
