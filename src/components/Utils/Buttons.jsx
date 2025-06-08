// components/ReusableButton.jsx
import React from 'react';

export const BackButton = ({ label, onClick, className = "" }) => {
    return (
        <button
            className={`btn btn-dark btn-sized-md m-1 btn-outline-light ${className}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

// export default ReusableButton;