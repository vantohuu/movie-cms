import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetail, updateMovie, getAllCountries, getAllPersons, getAllCategories, uploadMovieImage } from '../../Utils/api';
import './EditMovie.css';
import Sidebar from './Sidebar';
import ManageEpisodes from './ManageEpisodes';

const EditMovie = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [countries, setCountries] = useState([]);
  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const movieDetail = await getMovieDetail(movieId);
        setMovie(movieDetail);
        setFormData({
          // movieId: movieDetail.movieId,
          name: movieDetail.name,
          image: movieDetail.image,
          episodes: movieDetail.episodes,
          movieSchedule: movieDetail.movieSchedule,
          country: movieDetail.country.countryId,
          star: movieDetail.star,
          price: movieDetail.price,
          views: movieDetail.views,
          categories: movieDetail.categories.map(category => category.categoryId),
          persons: movieDetail.persons.map(person => person.personId),
          episodeList: movieDetail.episodeList,
          movieContent: movieDetail.movieContent
        });
        setLoading(false);
      } catch (error) {
        setError('Error fetching movie detail');
        setLoading(false);
      }
    };

    fetchMovieDetail();
    fetchCountries();
    fetchPersons();
    fetchCategories();
  }, [movieId]);

  const fetchCountries = async () => {
    try {
      const countriesData = await getAllCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchPersons = async () => {
    try {
      const personsData = await getAllPersons();
      setPersons(personsData);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleUploadMovieImage = async (idmovie) => {
    if (!idmovie) {
      alert('ID phim không hợp lệ');
      return;
    }
    try {
      const formDataUpImg = new FormData();
      formDataUpImg.append('fileUpload', newImage);
      formDataUpImg.append('id', idmovie);
      await uploadMovieImage(formDataUpImg);
      
    } catch (error) {
      alert('Lỗi tải ảnh lên, hãy thử lại sau!');
    }
  };
  
  

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const personIds = formData.persons.map(personId => ({ personId }));
      const categoryIds = formData.categories.map(categoryId => ({ categoryId }));
  
      const updatedData = {
        movieId: movieId,
        name: formData.name,
        image: newImage ? newImage.name : formData.image,
        episodes: formData.episodes,
        movieSchedule: formData.movieSchedule,
        countryId: formData.country,
        star: formData.star,
        price: formData.price,
        views: formData.views,
        status: 1,
        movieContent: formData.movieContent,
        persons: personIds,
        categories: categoryIds
      };
      await updateMovie(updatedData);
      if (newImage) {
        await handleUploadMovieImage(movieId);
      }
      alert('Đã sửa phim!');
      setEditMode(false);
      const updatedMovie = await getMovieDetail(updatedData.movieId);
      setMovie(updatedMovie);
    } catch (error) {
      alert('Lỗi sửa phim, hãy thử lại sau!');
    }
  };
  

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="no-movie">No movie found</div>;
  }

  return (
    <div className='main-content'>
      <Sidebar />
      <div className="movie-detail">
        <h2 className="title">{movie.name}</h2>
        <div className="details">
          <img src={`${process.env.REACT_APP_UPLOAD_URL}/${movie.image}`} alt={movie.name} className="poster" />
          <div className="info">
            <p className="episodes">Số tập: {movie.episodes}</p>
            <p className="schedule">Năm phát hành: {movie.movieSchedule}</p>
            <p className="country">Quốc gia: {movie.country.name}</p>
            <p className="star">Đánh giá: {movie.star}/5</p>
            <p className="price">Giá mua: {movie.price}</p>
            <p className="views">Lượt xem: {movie.views}</p>
            <div className="list_cate">
              <p>Thể loại</p>
              <div>
                {movie.categories.map(category => (
                  <Link key={category.categoryId}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="list_episode ah-frame-bg">
              <div className="heading flex flex-space-auto fw-700">
                <p>Danh sách tập</p>
                <span id="newest-ep-is-readed" className="fs-13"></span>
              </div>
              <div className="list-item-episode scroll-bar">
                {movie.episodeList.map(episode => (
                  <div key={episode.episodeId} className="episode-item">
                    <Link to={`/admin/watch/${movieId}/${episode.episodeId}`} target="_blank">
                      <span>{episode.episode}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        <p className="content">Mô tả: {movie.movieContent}</p>
      <div>
        <p>Diễn viên:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {movie.persons.map(person => (
            <div key={person.personId} style={{ margin: '10px', textAlign: 'center' }}>
              <img src={`${process.env.REACT_APP_UPLOAD_URL}/${person.image}`} alt={person.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
              <span style={{ display: 'block', marginTop: '5px' }}>{person.name}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleEditToggle}>{editMode ? 'Huỷ' : 'Sửa'}</button>
{editMode && (
  <div className='edit-form-container'>
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Chọn ảnh</label>
        <input type="file" onChange={handleImageChange} />
      </div>
      <div className="form-group">
        <label htmlFor="episodes">Số tập:</label>
        <input type="number" id="episodes" value={formData.episodes} onChange={(e) => setFormData({ ...formData, episodes: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="movieSchedule">Năm:</label>
        <input type="text" id="movieSchedule" value={formData.movieSchedule} onChange={(e) => setFormData({ ...formData, movieSchedule: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="country">Quốc gia:</label>
        <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
          {countries.map(country => (
            <option key={country.countryId} value={country.countryId}>{country.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="price">Giá:</label>
        <input type="number" id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="categories">Thể loại:</label>
        <select value={formData.categories} onChange={(e) => setFormData({ ...formData, categories: Array.from(e.target.selectedOptions, option => parseInt(option.value)) })} multiple={true}>
          {categories.map(category => (
            <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="persons">Diễn viên:</label>
        <select value={formData.persons} onChange={(e) => setFormData({ ...formData, persons: Array.from(e.target.selectedOptions, option => parseInt(option.value)) })} multiple={true}>
          {persons.map(person => (
            <option key={person.personId} value={person.personId}>{person.name}</option>
          ))}
        </select>
      </div>
      <div className="form-buttons">
        <button type="submit" className="save-button">Lưu</button>
        <button type="button" className="cancel-button" onClick={handleEditToggle}>Huỷ</button>
      </div>
    </form>
  </div>
)}


        <ManageEpisodes />
      </div>
    </div>
  );
};

export default EditMovie;









