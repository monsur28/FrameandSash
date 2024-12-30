import { useState } from "react";
import Stepper from "./Stepper";
import CreateWindows from "./CreateWindows";
import CreateAccessories from "./CreateAccessories";
import Submission from "./Submission";

const steps = [
  { icon: "📝", title: "Create Windows" },
  { icon: "🔧", title: "Create Accessories" },
  { icon: "✓", title: "Submission" },
];

export default function AddProduct() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="">
      <Stepper currentStep={currentStep} steps={steps} />

      {currentStep === 0 && <CreateWindows onNext={handleNext} />}
      {currentStep === 1 && (
        <CreateAccessories onNext={handleNext} onPrevious={handlePrevious} />
      )}
      {currentStep === 2 && <Submission onPrevious={handlePrevious} />}
    </div>
  );
}
