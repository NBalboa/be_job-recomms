import APPLICANT from "../modules/applicant/applicant.route.mjs";
import ADMIN from "../modules/admin/admin.route.mjs";
import USER from "../modules/user/user.route.mjs";
import EMPLOYEER from "../modules/employeer/employeer.route.mjs";
const routers = (app) => {
    app.use("/applicant", APPLICANT);
    app.use("/admin", ADMIN);
    app.use("/user", USER);
    app.use("/employeer", EMPLOYEER);
};

export { routers };
