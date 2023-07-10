import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";



export default function Categories() {
  const [editedCat, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);



  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {name,parentCategory}
    if (editedCat) {
      data._id = editedCat._id
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  

   function deleteCategory(category) {
    Swal.fire({
      title: `Do you want to delete ${category.name}?`,
      showDenyButton: true,
      confirmButtonText: 'Yes, Delete!',
      denyButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#d55',
      denyButtonColor: '#808080'
    }).then(async result => {
      if (result.isConfirmed) {
        const {_id} = category
        Swal.fire('Saved!', '', 'success')
          await axios.delete('/api/categories?_id=' +_id, {_id}),
          fetchCategories()
        
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>{editedCat 
      ? `Edit category ${editedCat.name}`
      : 'Create new Category'}</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"Category name"}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <select
          className="mb-0"
          onChange={(ev) => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option value="0"> No parent category</option>

          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td className="flex">
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-primary mr-1"
                  >
                    Edit
                  </button>
                  <button className="btn-primary"
                  onClick={() => deleteCategory(category)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};




