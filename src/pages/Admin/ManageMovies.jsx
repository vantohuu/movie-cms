import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMovies, deleteMovie } from '../../Utils/api';
import Sidebar from './Sidebar';
import './ManageMovie.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import AddMovie from './AddMovie';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Bạn có chắc muốn xoá phim này?')) {
    try {
      await deleteMovie(movieId);
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Xoá phim không thành công vì đang có liên kết với dữ liệu khác!');
    }
  }
  };

  return (
    <div className='main-content'>
      <Sidebar />
      <AddMovie fetchMovies={fetchMovies} />
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th></th>
              <th>Tên phim</th>
              <th>Số tập</th>
              <th>Lịch chiếu</th>
              <th>Quốc gia</th>
              <th>Số sao</th>
              <th>Giá</th>
              <th>Lượt xem</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.movieId}>
                <td>{movie.movieId}</td>
                <td>
                  <img
                    src={`${process.env.REACT_APP_UPLOAD_URL}/${movie.image}`}
                    alt="image"
                    style={{ width: '33px', height: 'auto' }}
                  />
                </td>
                <td>{movie.name}</td>
                <td>{movie.episodes}</td>
                <td>{movie.movieSchedule}</td>
                <td>{movie.country.name}</td>
                <td>{movie.star}</td>
                <td>{movie.price}</td>
                <td>{movie.views}</td>
                <td>
                  <Link to={`/admin/edit-movie/${movie.movieId}`} target="_blank">
                    <FaEdit style={{ cursor: 'pointer' }} />
                  </Link>
                  <FaTrashAlt
                    onClick={() => handleDelete(movie.movieId)}
                    style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMovies;
