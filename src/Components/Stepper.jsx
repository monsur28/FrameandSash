export default function Stepper({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-between lg:max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              index <= currentStep ? "bg-teal-500" : "bg-gray-100"
            }`}
          >
            <span
              className={`text-xl ${
                index <= currentStep ? "text-white" : "text-gray-400"
              }`}
            >
              {step.icon}
            </span>
          </div>
          <div className={`ml-3 ${index === steps.length - 1 ? "hidden" : ""}`}>
            <div
              className={`h-1 w-8 lg:w-48 ${
                index < currentStep ? "bg-teal-500" : "bg-gray-200"
              }`}
            />
          </div>
          <div
            className="absolute mt-16 text-center"
            style={{ marginLeft: "-1rem" }}
          >
            <span
              className={`text-sm ${
                index <= currentStep ? "text-teal-500" : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
