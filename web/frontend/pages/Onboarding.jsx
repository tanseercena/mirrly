import React, { useState } from "react";
import Step0 from "../components/Onboarding/Step0";
import Step1 from "../components/Onboarding/Step1";
import Congratulations from "../components/Onboarding/Congratulations";
import { useNavigate } from "react-router-dom";

import {
    Button,
    Modal,
    LegacyStack,
    DropZone,
    Checkbox,
    BlockStack,
    Frame,
    Box,
    Page,
    Text,
} from "@shopify/polaris";

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [selectedProductType, setSelectedProductType] = useState("");
    const [productData, setProductData] = useState(null);

    // Handle product type selection from enhanced Step1
    const handleProductTypeSelection = (completedData) => {
        console.log("Product setup completed:", completedData);
        
        setSelectedProductType(completedData.productType);
        setProductData(completedData);

        // Navigate based on product type (keeping your existing logic)
        switch (completedData.productType) {
            case "file":
                setStep(5); // Files component
                break;
            case "pdf":
                setStep(7); // PDF component  
                break;
            case "license":
                setStep(8); // License component
                break;
            case "ticket":
                setStep(9); // Ticket component
                break;
            case "links":
                setStep(10); // Links component
                break;
                 case "mixedContent":
                setStep(11); // Links component
                break;
                  case "notSure":
                setStep(12); // Links component
                break;
            default:
                setStep(4); // Default completion step
                break;
        }
    };

    const handleBackToStep1 = () => {
        setStep(1);
        setSelectedProductType("");
        setProductData(null);
    };

    return (
        <div>
            {/* Background image */}
            <img
                style={{
                    width: "-webkit-fill-available",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    // zIndex: -1,
                }}
                src="/images/bg_onboarding.png"
                alt="Onboarding background"
            />

            {/* Step 0: Welcome page */}
            {step === 0 && (
                <Step0 handleNextAction={() => setStep(1)} />
            )}

            {/* Step 1: Enhanced Product type selection and configuration */}
            {step === 1 && (
                <Step1 onComplete={handleProductTypeSelection} />
            )}

            {/* Your existing components for specific product types */}
            {step === 5 && (
                <div>
                   <Congratulations onComplete={() => navigate('/')} />
                </div>
            )}

            {step === 7 && (
                <div>
                   <Congratulations onComplete={() => navigate('/')} />
                </div>
            )}

            {step === 8 && (
                <div>
                     <Congratulations onComplete={() => navigate('/')} />
                </div>
            )}

            {step === 9 && (
                <div>
                    <Text variant="headingLg" as="h3">Ticket Component</Text>
                    <Text>Ticket/QR setup will go here</Text>
                    <Button onClick={handleBackToStep1}>Back to Setup</Button>
                    <Button
                        primary
                        onClick={() => navigate('/digitalProducts')}
                        style={{ marginLeft: '10px' }}
                    >
                        Complete & Go to Digital Products
                    </Button>
                </div>
            )}

            {step === 10 && (
                <div>
                     <Congratulations onComplete={() => navigate('/')} />
                </div>
            )}

            {step === 11 && (
                <div>
                     <Congratulations onComplete={() => navigate('/')} />
                </div>
            )}

             {step === 12 && (
                <div>
                     <Congratulations onComplete={() => navigate('/')} />
                </div>
            )}

            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ 
                    position: 'fixed', 
                    bottom: '10px', 
                    right: '10px', 
                    background: 'rgba(0,0,0,0.8)', 
                    color: 'white', 
                    padding: '10px', 
                    borderRadius: '5px',
                    fontSize: '12px'
                }}>
                    <div>Step: {step}</div>
                    <div>Product Type: {selectedProductType}</div>
                    <div>Has Data: {productData ? 'Yes' : 'No'}</div>
                </div>
            )}
        </div>
    );
};                                          
export default Onboarding;