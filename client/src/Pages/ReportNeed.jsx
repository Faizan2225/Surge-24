import ReportNeedForm from "../components/reportNeedComponent";
import { useAuthStore } from "../Store/authStore";
import Cookies from "js-cookie";

const ReportNeedPage = () => {
  const token = Cookies.get("token");
  const user = useAuthStore((state) => state.user);
  console.log(user, token);

  if (!token) {
    return (
      <p className="text-center text-error">Please log in to report a need.</p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <div className="w-full max-w-3xl">
        <ReportNeedForm token={token} />
      </div>
    </div>
  );
};

export default ReportNeedPage;
