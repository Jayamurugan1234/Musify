import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Home from "./pages/Home";

import RegisterUser from "./pages/auth/RegisterUser";
import RegisterArtist from "./pages/auth/RegisterArtist";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import UploadSong from "./pages/UploadSong";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import RecentlyPlayed from "./pages/RecentlyPlayed";

import ProtectedRoute from "./routes/ProtectedRoute";

import UserDashboard from "./pages/dashboard/UserDashboard";
import ArtistDashboard from "./pages/dashboard/ArtistDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import MusicPlayer from "./components/MusicPlayer";
// import MiniPlayer from "./components/MiniPlayer";
import Favorites from "./pages/Favorites/Favorites";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT REDIRECT */}
        <Route path="/" element={<Login />} />

        {/* AUTH */}
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-artist" element={<RegisterArtist />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        {/* USER DASHBOARD */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/favorites" element={<Favorites />} />

        {/* ARTIST DASHBOARD */}
        <Route
          path="/artist"
          element={
            <ProtectedRoute allowedRoles={["artists"]}>
              <ArtistDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* MUSIC FEATURES */}
        <Route
          path="/upload-song"
          element={
            <ProtectedRoute allowedRoles={["artists", "admin"]}>
              <UploadSong />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <ProtectedRoute allowedRoles={["user", "artists", "admin"]}>
              <Playlists />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlists/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "artists", "admin"]}>
              <PlaylistDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recent"
          element={
            <ProtectedRoute allowedRoles={["user", "artists", "admin"]}>
              <RecentlyPlayed />
            </ProtectedRoute>
          }
        />

        {/* OPTIONAL HOME */}
        <Route path="/home" element={<Home />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      {/* GLOBAL PLAYERS */}
      <MusicPlayer />
      {/* <MiniPlayer /> */}

    </BrowserRouter>
  );
}

export default App;