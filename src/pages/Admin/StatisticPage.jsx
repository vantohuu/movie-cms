// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { getAllMovies } from '../../Utils/api';a

// const StatisticsPage = () => {
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const moviesData = await getAllMovies(); // Gọi API để lấy dữ liệu phim
//         setMovies(moviesData);
//       } catch (error) {
//         console.error('Error fetching movies data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Xử lý dữ liệu từ API để tạo dữ liệu cho biểu đồ
//   const processDataForChart = () => {
//     const categoriesCount = {}; // Đếm số lượng phim theo từng thể loại

//     movies.forEach(movie => {
//       movie.categories.forEach(category => {
//         if (categoriesCount[category.name]) {
//           categoriesCount[category.name]++;
//         } else {
//           categoriesCount[category.name] = 1;
//         }
//       });
//     });

//     const labels = Object.keys(categoriesCount);
//     const data = Object.values(categoriesCount);

//     return { labels, data };
//   };

//   const chartData = processDataForChart();

//   // Cấu hình biểu đồ
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Thống kê số lượng phim theo thể loại</h1>
//       <div style={{ height: '400px', width: '600px' }}>
//         <Bar data={{ labels: chartData.labels, datasets: [{ label: 'Số lượng phim', data: chartData.data, backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] }} options={chartOptions} />
//       </div>
//     </div>
//   );
// };

// export default StatisticsPage;
