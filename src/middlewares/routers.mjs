import APPLICANTS from "../modules/applicant/applicant.route.mjs";
import ADMINS from "../modules/admin/admin.route.mjs";
import USERS from "../modules/user/user.route.mjs";
import EMPLOYERS from "../modules/employeer/employeer.route.mjs";
import JOBS from "../modules/jobs/jobs.route.mjs";

const routers = (app) => {
    app.use("/applicants", APPLICANTS);
    app.use("/admins", ADMINS);
    app.use("/users", USERS);
    app.use("/employers", EMPLOYERS);
    app.use("/jobs", JOBS);
};

export { routers };
