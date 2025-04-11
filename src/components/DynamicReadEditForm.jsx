
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DynamicReadEditForm({ formId }) {
  const [formData, setFormData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch form from DB
  useEffect(() => {
    axios.get(`/api/form/${formId}`)
      .then(res => {
        setFormData(res.data.fields);
      })
      .catch(err => console.error(err));
  }, [formId]);

  const handleChange = (e, index) => {
    const updated = [...formData];
    updated[index].value = e.target.value;
    setFormData(updated);
  };

  const handleSubmit = () => {
    axios.post(`/api/form/${formId}`, { fields: formData })
      .then(() => {
        alert("Form updated!");
        setIsEditing(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <h3>Form</h3>
      {formData.map((field, index) => (
        <div key={field.name} className="mb-3">
          <label>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={(e) => handleChange(e, index)}
            disabled={!isEditing}
            className="form-control"
          />
        </div>
      ))}
      <div>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <button className="btn btn-success" onClick={handleSubmit}>Save</button>
        )}
      </div>
    </div>
  );
}