export const environment = {
    url:
        import.meta.env.MODE === "production"
            ? "http://ec2-3-0-89-152.ap-southeast-1.compute.amazonaws.com"
            : "http://localhost:3000",
};
