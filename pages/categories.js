import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Categories() {
  const [editedCat, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    setIsLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { 
      name, 
      parentCategory, 
      properties:properties.map(p => ({
        name:p.name,values:p.values.split(',')
      }))};
    if (editedCat) {
      data._id = editedCat._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({name,values}) => ({
        name,
        values: values.join(',')
      }))
      );
  }

  function deleteCategory(category) {
    Swal.fire({
      title: `Do you want to delete ${category.name}?`,
      showDenyButton: true,
      confirmButtonText: "Yes, Delete!",
      denyButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
      denyButtonColor: "#808080",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        Swal.fire("Saved!", "", "success");
        await axios.delete("/api/categories?_id=" + _id, { _id }),
          fetchCategories();
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      const newProperties = [...prev];
      return newProperties.filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCat ? `Edit category ${editedCat.name}` : "Create new Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
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
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            {" "}
            Add new Property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={property} className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePNameChange(index, property, ev.target.value)
                  }
                  placeholder="property name (example: color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={(ev) =>
                    handlePValuesChange(index, property, ev.target.value)
                  }
                  placeholder="values, comma separated"
                />
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="btn-default"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCat && (
            <button type="button"
            onClick={() => {setEditedCategory(null);
            setName('');
            setParentCategory('');
            setProperties([]);
            }}
            className="btn-primary">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
      {isLoading && <Spinner fullWidth={true} />}
      {!editedCat && !isLoading && (
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
                    <button
                      className="btn-primary"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
