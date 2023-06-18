FROM progrium/busybox

COPY ./sandbox/sandbox /sandbox
COPY ./jlox/jlox ./jlox
WORKDIR /
ENTRYPOINT ["/sandbox"]