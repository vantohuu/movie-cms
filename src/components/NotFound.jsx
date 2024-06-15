import React from 'react';
import { Link } from 'react-router-dom';
import svg404 from '../assets/Images/404.svg';

const NotFound = () => {
  return (
      <>
          <div className="cont-404">
              <img src={svg404} alt="svg" />

              <Link to="/"><button>Về trang chủ</button></Link>
          </div>

          
      </>
  );
};

export default NotFound;
