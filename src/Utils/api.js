import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


//instance
export const getAuthToken = () => window.localStorage.getItem('token');

export const setAuthHeader = (token) => {
    if (token !== null) {
        window.localStorage.setItem("token", token);
    } else {
        window.localStorage.removeItem("token");
    }
};

axios.defaults.baseURL = 'http://localhost';
// axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const createAxiosRequest = async (method, url, data = null) => {
    try {
        const headers = getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {};
        const response = await axios({ method, url, headers, data });
        return response.data.data;
    } catch (error) {
        console.error(`API Request Error for ${url}:`, error);
        throw error;
    }
};



export const login = async (username, password, email) => {
    try {
        const response = await axios.post('/api/login/signin', { username, password, email });
        const responseData = response.data;

        if (responseData.success) {
            const token = responseData.data;
            setAuthHeader(token);

            // Giải mã token để lấy thông tin người dùng
            const decodedToken = jwtDecode(token);
            const id = decodedToken.sub;

            // Gọi hàm getUserInfo để lấy thông tin người dùng từ id
            const userInfo = await getUserInfo(id);

            // Kiểm tra quyền admin
            if (userInfo.role == 'ADMIN') {
                throw new Error('User is authorized');
            }

            // Lưu token và thông tin người dùng vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            return responseData;
        } else {
            throw new Error('Invalid credentials'); // Xử lý lỗi đăng nhập không hợp lệ
        }
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
}


export const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return false;
    }

    const decodedToken = jwtDecode(token); // Giải mã token để lấy thông tin payload
    const tokenExpiration = decodedToken.exp * 1000; // Chuyển giây thành mili-giây

    const currentTime = Date.now();
    if (currentTime > tokenExpiration) {
        return false;
    }

    return true;
};


export const getUserInfo = async () => {
    try {
        const token = getAuthToken();
        const decodedToken = jwtDecode(token);
        const id = decodedToken.sub;

        const response = await axios.get(`/api/admin/movie-user/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

export const uploadUserAvatar = async (formData) => {
    try {
      const response = await axios.post(`/api/admin/movie-user/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Cập nhật lại thông tin người dùng trong localStorage
      const token = getAuthToken();
      const userInfo = await getUserInfo(token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
  
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };



export const updateUserInfo = async (username, userData) => {
    try {
        const response = await axios.put(`/api/admin/movie-user/update`, { ...userData, username }, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });

        // Cập nhật lại thông tin người dùng trong localStorage
        const token = getAuthToken();
        const userInfo = await getUserInfo(token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        return response.data.data;
    } catch (error) {
        throw error;
    }
};


//get phim
export const getAllMovies = async () => createAxiosRequest('GET', '/api/admin/movie/get-all');
export const getMovieDetail = async (movieId) => createAxiosRequest('GET', `/api/admin/movie/${movieId}`);
export const getAllMoviesByCategory = async (categoryId) => createAxiosRequest('GET', `/api/admin/movie/get-all-by-category?category_id=${categoryId}`);
export const getAllMoviesByCountry = async (countryId) => createAxiosRequest('GET', `/api/admin/movie/get-all-by-country?country_id=${countryId}`);
export const getNewMovies = async (top) => createAxiosRequest('GET', `/api/admin/movie/get-new-movies?top=${top}`);
export const getMoviesRandom = async (top) => createAxiosRequest('GET', `/api/admin/movie/get-random?top=${top}`);
export const getMoviesForHomePage = async (loaiPhim) => {
    try {
        const response = await createAxiosRequest('GET', `/api/admin/movie/get-phim-trang-chu/${loaiPhim}`);
        return response;
    } catch (error) {
        console.error('Error fetching movies for homepage:', error);
        throw error;
    }
};

//quoc gia
export const getAllCountries = async () => createAxiosRequest('GET', '/api/admin/country/get-all');
export const getCountryDetail = async (countryId) => createAxiosRequest('GET', `/api/admin/country/${countryId}`);
export const getAllCategories = async () => createAxiosRequest('GET', '/api/admin/category/get-all');


//dien vien
export const getAllPersons = async () => createAxiosRequest('GET', '/api/admin/person/get-all');
export const getPersonDetail = async (personId) => createAxiosRequest('GET', `/api/admin/person/${personId}`);
export const addPerson = async (personData) => createAxiosRequest('POST', '/api/admin/person/create', personData);
export const updatePerson = async (personId, newData) => createAxiosRequest('PUT', `/api/admin/person/update?id=${personId}`, newData);
export const deletePerson = async (personId) => createAxiosRequest('DELETE', `/api/admin/person/delete?id=${personId}`);
export const uploadPersonImage = async (formData) => {
    try {
        const response = await axios.post(`/api/admin/person/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};



//phim
export const addMovie = async (movieData) => createAxiosRequest('POST', '/api/admin/movie/create', movieData);
export const updateMovie = async (movieData) => {
    try {
        const response = await axios.put(`/api/admin/movie/update`, movieData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};
export const deleteMovie = async (movieId) => createAxiosRequest('DELETE', `/api/admin/movie/delete?id=${movieId}`);
export const uploadMovieImage = async (formData) => {
    try {
      const response = await axios.post(`/api/admin/movie/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

//tap phim
export const addEpisode = async (episodeData) => createAxiosRequest('POST', '/api/admin/episode/create', episodeData);
// export const updateEpisode = async (episodeId, newData) => createAxiosRequest('PUT', `/api/admin/episode/update?id=${episodeId}`, newData);
export const updateEpisode = async (episodeData) => {
    try {
        const response = await axios.put(`/api/admin/episode/update`, episodeData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};
export const deleteEpisode = async (episodeId) => createAxiosRequest('DELETE', `/api/admin/episode/delete?id=${episodeId}`);
export const getEpisodeDetail = async (episodeId) => createAxiosRequest('GET', `/api/admin/episode/${episodeId}`);
export const uploadEpisodeVideo = async (formData) => {
    try {
        const response = await axios.post(`/api/admin/episode/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};




//the loai
export const getCategoryNameById = async (categoryId) => {
    const category = await createAxiosRequest('GET', `/api/admin/category/${categoryId}`);
    return category.name;
};

export const addCategory = async (categoryData) => createAxiosRequest('POST', '/api/admin/category/create', categoryData);
export const updateCategory = async (categoryId, newData) => createAxiosRequest('PUT', `/api/admin/category/update?id=${categoryId}`, newData);
export const deleteCategory = async (categoryId) => createAxiosRequest('DELETE', `/api/admin/category/delete?id=${categoryId}`);


//quoc gia
export const getCountryNameById = async (countryId) => {
    const country = await createAxiosRequest('GET', `/api/admin/country/${countryId}`);
    return country.name;
};

export const addCountry = async (countryData) => createAxiosRequest('POST', '/api/admin/country/create', countryData);
export const updateCountry = async (countryId, newData) => createAxiosRequest('PUT', `/api/admin/country/update?id=${countryId}`, newData);
export const deleteCountry = async (countryId) => createAxiosRequest('DELETE', `/api/admin/country/delete?id=${countryId}`);
