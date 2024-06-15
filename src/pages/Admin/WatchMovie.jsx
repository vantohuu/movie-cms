import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetail } from '../../Utils/api';

import './WatchMovie.css';

const WatchMovie = () => {
  const { movieId, episodeId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const movieDetail = await getMovieDetail(movieId);
        setMovie(movieDetail);
      } catch (error) {
        console.error('Error fetching movie detail:', error);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const selectedEpisode = movie.episodeList.find(episode => episode.episodeId === parseInt(episodeId));

  return (
    <div className='mainBody'>
      <div className='watchMovie'>
      <div className='movieName'>Phim: {movie.name}</div>

      {selectedEpisode && (
        <div className='video-container'>
          <h3>{selectedEpisode.name}</h3>
          <video controls>
            {/* <source src={selectedEpisode.link} type="video/mp4" /> */}
            <source src={`${process.env.REACT_APP_UPLOAD_URL}/${selectedEpisode.link}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <h3>Danh sách tập:</h3>
      <ul className='episode-list'>
        {movie.episodeList.map(episode => (
          <li key={episode.episodeId}>
            <a href={`/admin/watch/${movieId}/${episode.episodeId}`}>{episode.episode}</a>
          </li>
        ))}
      </ul>

      </div>
    </div>
  );
};

export default WatchMovie;
