import React, { useState, useEffect } from 'react';
import { getAllPersons, addPerson, updatePerson, deletePerson, getAllCountries, uploadPersonImage } from '../../Utils/api';
import Sidebar from './Sidebar';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ManagePersons = () => {
  const [persons, setPersons] = useState([]);
  const [countries, setCountries] = useState([]);
  const [newPerson, setNewPerson] = useState({
    name: '',
    gender: '',
    dayOfBirth: '',
    image: '',
    describe: '',
    countryId: 1
  });
  const [editPerson, setEditPerson] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchPersons();
    fetchCountries();
  }, []);

  const fetchPersons = async () => {
    try {
      const data = await getAllPersons();
      setPersons(data);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleAddPerson = async () => {
    try {
      const addedPerson = await addPerson(newPerson);
      
      // Upload image to server if an image is selected
      if (newImage) {
        await uploadImage(addedPerson.personId);
      }

      fetchPersons();
      resetNewPerson();
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const handleDeletePerson = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá người này?')) {
      try {
        await deletePerson(id);
        fetchPersons();
      } catch (error) {
        console.error('Error deleting person:', error);
      }
    }
  };

  const handleEditPerson = (person) => {
    setEditPerson(person);
  };

  const resetNewPerson = () => {
    setNewPerson({
      name: '',
      gender: '',
      dayOfBirth: '',
      image: '',
      describe: '',
      countryId: 1
    });
    setNewImage(null);
  };

  // Function to handle image upload
  const uploadImage = async (personId) => {
    try {
      const formData = new FormData();
      formData.append('fileUpload', newImage);
      formData.append('personId', personId);
      
      await uploadPersonImage(formData);

      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (editPerson) {
        await updatePerson(editPerson.personId, editPerson);
        
        if (newImage) {
          await uploadImage(editPerson.personId);
        }
        fetchPersons();
        setEditPerson(null);
      } else {
        console.error('No person to update');
      }
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  return (
    <div className='main-content'>
      <Sidebar />
      <h1>Quản lý diễn viên</h1>
      <div>
        <h2>Thêm diễn viên</h2>
        <input
          type="text"
          placeholder="Tên"
          value={newPerson.name}
          onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
        />

        <input
          type="file"
          onChange={(e) => setNewImage(e.target.files[0])} // Store the selected image in state
        />

        <select
          value={newPerson.countryId}
          onChange={(e) => setNewPerson({ ...newPerson, countryId: e.target.value })}
        >
          {countries.map(country => (
            <option key={country.countryId} value={country.countryId}>{country.name}</option>
          ))}
        </select>

        {/* Other input fields for gender, dayOfBirth, describe */}
        <button onClick={handleAddPerson}>Thêm</button>
      </div>
      <div>
        <h2>Danh sách diễn viên</h2>
        <table className='bangDienVien'>
          <thead>
            <tr>
              <th>ID</th>
              <th className="imageps-column">Avatar</th>
              <th>Tên</th>
              <th>Quốc gia</th>
              <th className='personactiontb'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr key={person.personId}>
                <td>{person.personId}</td>
                <td>
                  <img src={`${process.env.REACT_APP_UPLOAD_URL}/${person.image}`} alt="Person" style={{ width: '33px' }} />
                </td>
                <td>{person.name}</td>
                <td>{person.country.name}</td>
                <td>
                  {/* <button onClick={() => handleEditPerson(person)}>Sửa</button>
                  <button onClick={() => handleDeletePerson(person.personId)}>Xoá</button> */}

                  <FaEdit onClick={() => handleEditPerson(person)} style={{ cursor: 'pointer' }} />
                  <FaTrashAlt onClick={() => handleDeletePerson(person.personId)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} />
                </td>
              </tr>
            ))}
            {editPerson && (
              <tr>
                <td colSpan="5">
                  <div>
                    <h2>Edit Person</h2>
                    <input
                      type="text"
                      placeholder="Name"
                      value={editPerson.name}
                      onChange={(e) => setEditPerson({ ...editPerson, name: e.target.value })}
                    />

                    <input
                      type="file"
                      onChange={(e) => setNewImage(e.target.files[0])} // Store the selected image in state
                    />

                    <select
                      value={editPerson.countryId}
                      onChange={(e) => setEditPerson({ ...editPerson, countryId: e.target.value })}
                    >
                      {countries.map(country => (
                        <option key={country.countryId} value={country.countryId}>{country.name}</option>
                      ))}
                    </select>

                    {/* Other input fields for gender, dayOfBirth, describe */}
                    <button onClick={handleSaveEdit}>Save</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePersons;
