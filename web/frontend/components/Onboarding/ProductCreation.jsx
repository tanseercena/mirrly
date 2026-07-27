import React from "react";
import Step1 from "./Step1";
const ProductCreation = () => {
    return (
        <div>
            <Step1
                selectedType={selectedType}
                onTypeSelect={handleTypeSelect}
            />
        </div>
    );
};

export default ProductCreation;
