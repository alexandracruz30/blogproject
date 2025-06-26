import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BlogList from './pages/BlogList';
import BlogStats from './pages/BlogStats';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddBlog from './pages/AddBlog';
import BlogDetail from './pages/BlogDetail';
import CommentForm from './pages/CommentForm';
import { AuthProvider } from './contexts/AuthContext';
import AddReview from './pages/AddReview';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout showHeaderImage={true}>
                <BlogList />
              </Layout>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <Layout>
                <BlogDetail />
              </Layout>
            }
          />
          <Route
            path="/add-blog"
            element={
              <Layout>
                <AddBlog />
              </Layout>
            }
          />
          <Route
            path="/stats"
            element={
              <Layout>
                <BlogStats />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/blogs/:blogId/add-review"
            element={
              <Layout>
                <AddReview />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <Signup />
              </Layout>
            }
          />
          <Route
            path="/blogs/:blogId/reviews/:reviewId/add-comment"
            element={
              <Layout>
                <CommentForm />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;