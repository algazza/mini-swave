import Admin      from "./pages/Admin.svelte";
import AdminLogin from "./pages/AdminLogin.svelte";
import Home       from "./pages/Home.svelte";

export const routes = {
  "/":             Home,
  "/admin":        Admin,
  "/admin/login":  AdminLogin,
};
