export const environment = {
    url:
        import.meta.env.MODE === "production"
            ? "http://ec2-54-169-186-99.ap-southeast-1.compute.amazonaws.com"
            : "http://localhost:3000",
};
