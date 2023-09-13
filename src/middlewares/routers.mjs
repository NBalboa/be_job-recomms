import USERapi from "../modules/User/user.route.mjs";

const routers = (app) => {
    app.use("/user", USERapi);
};

export { routers };
