import React, { useState, useEffect } from 'react';
import { getAllCountries, addCountry, updateCountry, deleteCountry } from '../../Utils/api';
import Sidebar from './Sidebar';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ManageCountries = () => {
  const [countries, setCountries] = useState([]);
  const [newCountryName, setNewCountryName] = useState('');
  const [editCountryId, setEditCountryId] = useState(null);
  const [editCountryName, setEditCountryName] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleAddCountry = async () => {
    try {
      const newCountryData = { name: newCountryName };
      await addCountry(newCountryData);
      fetchCountries();
      setNewCountryName('');
    } catch (error) {
      console.error('Error adding country:', error);
    }
  };

  const handleUpdateCountry = async () => {
    try {
      const updatedCountryData = { countryId: editCountryId, name: editCountryName };
      await updateCountry(editCountryId, updatedCountryData);
      fetchCountries();
      setEditCountryId(null);
      setEditCountryName('');
    } catch (error) {
      console.error('Error updating country:', error);
    }
  };

  const handleDeleteCountry = async (id) => {
    try {
      await deleteCountry(id);
      fetchCountries();
    } catch (error) {
      console.error('Error deleting country:', error);
    }
  };

  const handleEditCountry = (id, name) => {
    setEditCountryId(id);
    setEditCountryName(name);
  };

  return (
    <div className='main-content'>
      <Sidebar/>
      <h1>Quản lý quốc gia</h1>
      <div>
        <h2>Thêm quốc gia</h2>
        <input
          type="text"
          value={newCountryName}
          onChange={(e) => setNewCountryName(e.target.value)}
        />
        <button onClick={handleAddCountry}>Thêm</button>
      </div>
      <div>
        <h2>Danh sách quốc gia</h2>
        <table className='bangQuocGia'>
          <thead>
            <tr>
              <th className='countryidtb'>ID</th>
              <th>Tên</th>
              <th className='countryactiontb'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.countryId}>
                <td>{country.countryId}</td>
                <td>
                  {editCountryId === country.countryId ? (
                    <input
                      type="text"
                      value={editCountryName}
                      onChange={(e) => setEditCountryName(e.target.value)}
                    />
                  ) : (
                    <span>{country.name}</span>
                  )}
                </td>
                <td>
                  {editCountryId === country.countryId ? (
                    <button onClick={handleUpdateCountry}>Save</button>
                  ) : (
                    <>
                      {/* <button onClick={() => handleEditCountry(country.countryId, country.name)}>Edit</button>
                      <button onClick={() => handleDeleteCountry(country.countryId)}>Delete</button> */}
                      <FaEdit onClick={() => handleEditCountry(country.countryId, country.name)} style={{ cursor: 'pointer' }} />
                      <FaTrashAlt onClick={() => handleDeleteCountry(country.countryId)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCountries;
