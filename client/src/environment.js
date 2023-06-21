export const environment = {
    url:
        import.meta.env.MODE === "production"
            ? "http://ec2-18-141-187-164.ap-southeast-1.compute.amazonaws.com/"
            : "http://localhost:3000",
};
