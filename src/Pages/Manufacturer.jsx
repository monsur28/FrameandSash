// Manufacturer.jsx

import CompanyList from "../Shared/CompanyList";

const Manufacturer = () => {
  const formFields = [
    { name: "logo", label: "Logo URL", type: "text" },
    { name: "name", label: "Company Name", type: "text" },
    { name: "reseller", label: "Reseller", type: "text" },
    { name: "totalSales", label: "Total Sales", type: "text" },
    { name: "rating", label: "Average Rating", type: "text" },
    { name: "package", label: "Package", type: "text" },
    { name: "expiry", label: "Expiry Date", type: "date" },
  ];

  const manufacturers = [
    {
      logo: "https://i.ibb.co/ryTWxGF/plygem.webp",
      name: "Ply Gem",
      reseller: "03",
      totalSales: "$5000",
      rating: "4.8",
      package: "Gold",
      expiry: "25-12-2025",
    },
    {
      logo: "https://i.ibb.co/yQGBMPk/Championwindows.webp",
      name: "Champion Windows",
      reseller: "05",
      totalSales: "$5100",
      rating: "4.9",
      package: "Gold",
      expiry: "20-11-2025",
    },
    {
      logo: "https://i.ibb.co/bmW36hz/alsidelogo.webp",
      name: "Alside, Inc",
      reseller: "07",
      totalSales: "$6500",
      rating: "5.0",
      package: "Platinum",
      expiry: "15-07-2025",
    },
    {
      logo: "https://i.ibb.co/z4C0B8z/pella-logo.webp",
      name: "Pella",
      reseller: "10",
      totalSales: "$7000",
      rating: "4.8",
      package: "Diamond",
      expiry: "10-08-2025",
    },
  ];

  const handleManufacturerSubmit = (formData) => {
    console.log("Manufacturer Data:", formData);
  };

  return (
    <div>
      <CompanyList
        title="Manufacturer Company List"
        formFields={formFields}
        data={manufacturers}
        onAddItem={() => {}}
        onSubmit={handleManufacturerSubmit}
        fieldToCompare="Total Sales"
      />
    </div>
  );
};

export default Manufacturer;
