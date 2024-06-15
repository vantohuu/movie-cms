import React, { useState, useEffect } from 'react';
import { getMovieDetail, addEpisode, deleteEpisode, updateEpisode, uploadEpisodeVideo } from '../../Utils/api';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import './ManageEpisodes.css';

const ManageEpisodes = () => {
  const { movieId } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [newEpisode, setNewEpisode] = useState({
    name: '',
    episode: '',
    link: '',
    season: '',
    daySubmit: '',
    movieId: movieId
  });
  const [editEpisode, setEditEpisode] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingEpisode, setIsAddingEpisode] = useState(false);

  useEffect(() => {
    fetchEpisodes();
  }, [movieId]);

  const fetchEpisodes = async () => {
    try {
      const movieDetail = await getMovieDetail(movieId);
      setEpisodes(movieDetail.episodeList);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const handleAddEpisode = async () => {
    try {
      const addedEpisode = await addEpisode(newEpisode);

      if (newVideo) {
        await uploadVideo(addedEpisode.episodeId);
      }

      fetchEpisodes();
      resetNewEpisode();
      setIsAddingEpisode(false);
      setMessage('Tập phim đã được thêm thành công!');
    } catch (error) {
      console.error('Error adding episode:', error);
      setMessage('Có lỗi xảy ra khi thêm tập phim.');
    }
  };

  const handleDeleteEpisode = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá tập này không?')) {
      try {
        await deleteEpisode(id);
        fetchEpisodes();
        setMessage('Tập phim đã được xoá thành công!');
      } catch (error) {
        console.error('Error deleting episode:', error);
        setMessage('Có lỗi xảy ra khi xoá tập phim.');
      }
    }
  };

  const handleEditEpisode = (episode) => {
    setEditEpisode(episode);
  };

  const resetNewEpisode = () => {
    setNewEpisode({
      name: '',
      episode: '',
      link: '',
      season: '',
      daySubmit: '',
      movieId: movieId
    });
    setNewVideo(null);
  };

  const uploadVideo = async (episodeId) => {
    try {
      setIsUploading(true);  // Bắt đầu quá trình tải lên
      setUploadProgress(0);  // Đặt lại tiến trình tải lên về 0
      const formData = new FormData();
      formData.append('fileUpload', newVideo);
      formData.append('id', episodeId);
  
      await uploadEpisodeVideo(formData, (event) => {
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      });
  
      console.log('Video uploaded successfully');
      setMessage('Video đã được upload thành công!');
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage('Có lỗi xảy ra khi upload video.');
    } finally {
      setIsUploading(false);  // Kết thúc quá trình tải lên
    }
  };
  
  const handleSaveEdit = async () => {
    try {
      const updatedData = {
      episodeId: editEpisode.episodeId,
      name: editEpisode.name,
      episode: editEpisode.episode,
      link: editEpisode.link,
      season: editEpisode.season,
      daySubmit: editEpisode.daySubmit,
      movieId: movieId
      };
      if (editEpisode) {
        await updateEpisode(updatedData);
        if (newVideo) {
          await uploadVideo(editEpisode.episodeId);
        }
        fetchEpisodes();
        setEditEpisode(null);
        setMessage('Tập phim đã được lưu thành công!');
      } else {
        console.error('No episode to update or episode ID is null');
        setMessage('Không có tập phim nào để lưu hoặc ID của tập phim là null.');
      }
    } catch (error) {
      console.error('Error updating episode:', error);
      setMessage('Có lỗi xảy ra khi lưu tập phim.');
    }
  };

  const handleCancelEdit = () => {
    setEditEpisode(null);
    setNewVideo(null);
  };

  return (
    <div className='main-content-epi'>
      

      {isAddingEpisode && (
        <div className="form-container">
          <h2>Thêm tập phim</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Tên"
              value={newEpisode.name}
              onChange={(e) => setNewEpisode({ ...newEpisode, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Tập"
              value={newEpisode.episode}
              onChange={(e) => setNewEpisode({ ...newEpisode, episode: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Link"
              value={newEpisode.link}
              onChange={(e) => setNewEpisode({ ...newEpisode, link: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Mùa"
              value={newEpisode.season}
              onChange={(e) => setNewEpisode({ ...newEpisode, season: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              placeholder="Ngày chỉnh sửa"
              value={newEpisode.daySubmit}
              onChange={(e) => setNewEpisode({ ...newEpisode, daySubmit: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              onChange={(e) => setNewVideo(e.target.files[0])}
            />
          </div>
          <button onClick={handleAddEpisode}>Thêm</button>
          <button onClick={() => setIsAddingEpisode(false)}>Hủy</button>
        </div>
      )}

      {message && <div className="message">{message}</div>} 
      {isUploading && <div className="spinner"></div>}
      {/* {isUploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <div className="progress-text">{uploadProgress}%</div>
        </div>
      )} */}

      <div className="episodes-list">
        <h3>Danh sách tập phim<button onClick={() => setIsAddingEpisode(true)}>Thêm tập</button></h3>
        <table className='bangTapPhim'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tập</th>
              <th>Tên</th>
              <th>Link</th>
              <th>Mùa</th>
              <th>Ngày chỉnh sửa</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode) => (
              <tr key={episode.episodeId}>
                <td>{episode.episodeId}</td>
                <td>{episode.episode}</td>
                <td>{episode.name}</td>
                <td>{episode.link}</td>
                <td>{episode.season}</td>
                <td>{episode.daySubmit}</td>
                <td>
                  <FaEdit onClick={() => handleEditEpisode(episode)} style={{ cursor: 'pointer' }} />
                  <FaTrashAlt onClick={() => handleDeleteEpisode(episode.episodeId)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editEpisode && (
        <div className="edit-form-container">
          <h2>Chỉnh sửa tập phim</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Tên"
              value={editEpisode.name}
              onChange={(e) => setEditEpisode({ ...editEpisode, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Tập"
              value={editEpisode.episode}
              onChange={(e) => setEditEpisode({ ...editEpisode, episode: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Link"
              value={editEpisode.link}
              onChange={(e) => setEditEpisode({ ...editEpisode, link: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Mùa"
              value={editEpisode.season}
              onChange={(e) => setEditEpisode({ ...editEpisode, season: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              placeholder="Ngày chỉnh sửa"
              value={editEpisode.daySubmit}
              onChange={(e) => setEditEpisode({ ...editEpisode, daySubmit: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              onChange={(e) => setNewVideo(e.target.files[0])}
            />
          </div>
          <div className="button-group">
            <button onClick={handleSaveEdit}>Lưu</button>
            <button onClick={handleCancelEdit}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEpisodes;
