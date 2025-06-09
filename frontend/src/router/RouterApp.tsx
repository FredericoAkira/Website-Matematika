import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuthStore } from "../api/auth"
import { UserRoleEnum } from "../component/userRole"
import { Login } from "../pages/Login"
import { NotFound } from "../pages/NotFound"
import { Register } from "../pages/Register"
import { AdminDashboard } from "../pages/admin/AdminDashboard"
import AdminHomePage from "../pages/admin/AdminHomePage"
import { EditMaterial } from "../pages/admin/Material/EditMaterial"
import { MaterialListAdmin } from "../pages/admin/Material/MaterialListAdmin"
import { QuizEdit } from "../pages/admin/Quiz/QuizEdit"
import { QuizListAdmin } from "../pages/admin/Quiz/QuizListAdmin"
import { EditTopic } from "../pages/admin/Topic/EditTopic"
import { TopicList } from "../pages/admin/Topic/TopicList"
import { HomePage } from "../pages/user/HomePage"
import { GroupDetailPage } from "../pages/user/ManageStudent/GroupDetail"
import { ManageStudentPage } from "../pages/user/ManageStudent/MainView"
import { StudentDetailPage } from "../pages/user/ManageStudent/StudentDetail"
import { MaterialDetail } from "../pages/user/Material/MaterialDetail"
import { MaterialListPage } from "../pages/user/Material/MaterialListPage"
import { ChatListPage } from "../pages/user/Messages/ChatListPage"
import { QuizListPage } from "../pages/user/Quiz/QuizListPage"
import { QuizPage } from "../pages/user/Quiz/QuizPage"
import { QuizPerMaterial } from "../pages/user/Quiz/QuizPerMaterial"
import UserLayout from "../pages/user/UserLayout"
import ProtectedRoute from "./ProtectedRoute"

const RouterApp = () => {
  const auth = useAuthStore((state) => state.role) ?? undefined;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Login/>} />
        <Route path="/register" element= {<Register/>} />

        <Route path="/*" element={<UserLayout/>}>
          <Route path="home" element={<HomePage />} />
          <Route path="learn" element={<MaterialListPage />}/>
          <Route path="learn/:materialName" element={<MaterialDetail />} />
          <Route path="quiz" element={<QuizListPage />} />
          <Route path="quiz/:materialName" element={<QuizPerMaterial />} />
          <Route path="quiz/:materialName/:quizName" element={<QuizPage/>} />
          <Route path="manageStudent" element={<ManageStudentPage />} />
          <Route path="manageStudent/:studentId" element={<StudentDetailPage />} />
          <Route path="manageStudent/group/:groupId" element={<GroupDetailPage />} />
          <Route path="dailyChallenge" element={<QuizPage/>} />
          <Route path="chat" element={<ChatListPage/>} />
          <Route path="chat/:groupId" element={<GroupDetailPage/>}/>
        </Route>

        {/* admin Route */}
        <Route
          element={<ProtectedRoute isAllowed={auth === UserRoleEnum.Admin} redirectPath="/" />}
        >
          <Route path="/admin/*" element={<AdminHomePage />}>
            <Route index element={<Navigate to="homePage" replace />} />
            <Route path="homePage" element={<AdminDashboard/>}/>
            <Route path="topic" element= {<TopicList/>}/>
            <Route path="topic/:topicName" element= {<EditTopic/>} />
            <Route path="material" element= {<MaterialListAdmin/>}/>
            <Route path="material/:materialName" element={<EditMaterial/>} />
            <Route path="quiz" element={<QuizListAdmin />} />
            <Route path="quiz/:quizName" element={<QuizEdit />} />
          </Route>
        </Route>

        {/* Error Page */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default RouterApp
