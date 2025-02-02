// AddProduct.jsx
import { useState } from "react";
import Stepper from "./Stepper";
import CreateAccessories from "./CreateAccessories";
import Submission from "./Submission";
import ProductDetails from "./ProductDetails";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

const steps = [
  { icon: "📝", title: "Product Details" },
  { icon: "🔧", title: "Create Accessories" },
  { icon: "✓", title: "Submission" },
];

export default function AddProduct() {
  const [currentStep, setCurrentStep] = useState(0);
  const { showAlert } = useSweetAlert();

  // More comprehensive Step 1 data
  const [windowsData, setWindowsData] = useState({
    productTitle: "",
    images: [],
    labels: {},
    dimensions: [],
    ingredients: [],
  });
  console.log(windowsData);

  // Step 2 data
  const [accessoriesData, setAccessoriesData] = useState({});

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Show success or final submission
      showAlert(
        "Submission Successful!",
        "Your product has been successfully submitted.",
        "success"
      );
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className=" p-4">
      <Stepper currentStep={currentStep} steps={steps} />

      {currentStep === 0 && (
        <ProductDetails
          windowsData={windowsData} // pass state data
          setWindowsData={setWindowsData} // pass the setter function
          onNext={handleNext} // next-step handler
        />
      )}

      {currentStep === 1 && (
        <CreateAccessories
          windowsData={windowsData}
          accessoriesData={accessoriesData}
          setAccessoriesData={setAccessoriesData}
          onPrev={handlePrevious}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <Submission
          windowsData={windowsData}
          accessoriesData={accessoriesData}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
