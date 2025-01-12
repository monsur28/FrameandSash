import { useState } from "react";
import Stepper from "./Stepper";
import CreateWindows from "./CreateWindows";
import CreateAccessories from "./CreateAccessories";
import Submission from "./Submission";
import { UseSweetAlert } from "../ContextProvider/SweetAlertContext";

const steps = [
  { icon: "📝", title: "Create Windows" },
  { icon: "🔧", title: "Create Accessories" },
  { icon: "✓", title: "Submission" },
];

export default function AddProduct() {
  const [currentStep, setCurrentStep] = useState(0);
  const { showAlert } = UseSweetAlert();

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Show SweetAlert when the user completes the submission
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
    <div>
      <Stepper currentStep={currentStep} steps={steps} />

      {currentStep === 0 && <CreateWindows onNext={handleNext} />}
      {currentStep === 1 && (
        <CreateAccessories onNext={handleNext} onPrevious={handlePrevious} />
      )}
      {currentStep === 2 && (
        <Submission onNext={handleNext} onPrevious={handlePrevious} />
      )}
    </div>
  );
}
