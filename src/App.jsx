import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Quiz from "@/components/pages/Quiz";
import Results from "@/components/pages/Results";
import Profile from "@/components/pages/Profile";
import Categories from "@/components/pages/Categories";
function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-white"
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quiz/:id" element={<Quiz />} />
<Route path="results/:id" element={<Results />} />
          <Route path="profile" element={<Profile />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </motion.div>
  );
}

export default App;