import React, { useState, useEffect } from 'react';
import { getAllCountries } from '../Utils/api'

function CountrySelect() {
  const [countries, setCountries] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryData = await getAllCountries(); // Gọi hàm API để lấy danh sách quốc gia
        setCountries(countryData); // Cập nhật state với danh sách quốc gia từ server
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchData();
  }, []); // useEffect chỉ chạy một lần khi component được render lần đầu tiên

  return (
    <div>
      <label htmlFor="country">Country:</label>
      <select id="country" name="country">
        {countries.map(country => (
          <option key={country.countryId} value={country.countryId}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySelect;
