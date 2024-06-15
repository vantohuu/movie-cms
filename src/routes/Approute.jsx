import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ManageCountriesPage from '../pages/Admin/ManageCountriesPage';
import ManageCategories from '../pages/Admin/ManageCategories';
import ManagePersons from '../pages/Admin/ManagePersons';
import ManageMovies from '../pages/Admin/ManageMovies';
import Sidebar from '../pages/Admin/Sidebar';
import LoginAdmin from '../pages/Auth/LoginAdmin';

import ManageEpisodes from '../pages/Admin/ManageEpisodes';
import EditMovie from '../pages/Admin/EditMovie';
import NotFound from '../components/NotFound';
import WatchMovie from '../pages/Admin/WatchMovie';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ManageMovies />} />

      <Route path="/admin/login" element={<LoginAdmin />} />

      
      <Route path="admin" element={<Sidebar/>} />
      <Route path="admin/manage-movies" element={<ManageMovies/>} />
      <Route path="admin/manage-categories" element={<ManageCategories/>} />
      <Route path="admin/manage-countries" element={<ManageCountriesPage/>} />
      <Route path="admin/manage-actors" element={<ManagePersons/>} />
      <Route path="admin/edit-movie/:movieId" element={<EditMovie/>} />
      <Route path="admin/watch/:movieId/:episodeId" element={<WatchMovie/>} />
      <Route path="admin/movie/:movieId" element={<ManageEpisodes/>} />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;