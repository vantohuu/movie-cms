import React, { useState, useEffect } from 'react';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../../Utils/api';
import Sidebar from './Sidebar';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const newCategoryData = { name: newCategoryName };
      await addCategory(newCategoryData);
      fetchCategories();
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const updatedCategoryData = { categoryId: editCategoryId, name: editCategoryName };
      await updateCategory(editCategoryId, updatedCategoryData);
      fetchCategories();
      setEditCategoryId(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditCategory = (id, name) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
  };

  return (
    <div className='main-content'>
      <Sidebar/>
      <h1>Quản lý thể loại</h1>
      <div>
        <h2>Thêm thể loại</h2>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory}>Thêm</button>
      </div>
      <div>
        <h2>Danh sách thể loại</h2>
        <table className='bangTheLoai'>
          <thead>
            <tr>
              <th className='theloaiidtb'>ID</th>
              <th>Tên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>
                  {editCategoryId === category.categoryId ? (
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                  ) : (
                    <span>{category.name}</span>
                  )}
                </td>
                <td>
                  {editCategoryId === category.categoryId ? (
                    <button onClick={handleUpdateCategory}>Save</button>
                  ) : (
                    <>
                      <FaEdit onClick={() => handleEditCategory(category.categoryId, category.name)} style={{ cursor: 'pointer' }} />
                      <FaTrashAlt onClick={() => handleDeleteCategory(category.categoryId)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} />
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

export default ManageCategories;
