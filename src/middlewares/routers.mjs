import APPLICANT from "../modules/Applicant/applicant.route.mjs";
import ADMIN from "../modules/Admin/admin.route.mjs";
import USER from "../modules/User/user.route.mjs";
const routers = (app) => {
    app.use("/applicant", APPLICANT);
    app.use("/admin", ADMIN);
    app.use("/user", USER);
};

export { routers };
