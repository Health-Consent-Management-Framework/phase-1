const Facility = artifacts.require("facility")

module.exports = async function(deployer) {
  const facilityContractInstance = await Facility.deployed();
  await addDummyFacilities(facilityContractInstance);
};
  
  async function addDummyFacilities(contractInstance) {
    // Add 10 dummy facilities with appropriate names, India-related data, and brief descriptions
    await contractInstance.createFacility(
      "Apollo Hospital",
      "Tamil Nadu",
      "Chennai",
      "Mount Road",
      "600002",
      1, // AccessType.Private
      "A leading multi-speciality hospital providing advanced medical care services.",
      `https://media.gettyimages.com/id/1312706413/photo/modern-hospital-building.jpg?s=612x612&w=gi&k=20&c=1-EC4Mxf--5u4ItDIzrIOrduXlbKRnbx9xWWtiifrDo=`
    );
  
    await contractInstance.createFacility(
      "AIIMS Delhi",
      "Delhi",
      "New Delhi",
      "Safdarjung Road",
      "110029",
      0, // AccessType.Public
      "A premier medical institute and hospital in India, known for its excellence in healthcare.",
      `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYYGIDP8sX1p40tsSvxK-3MaSTaoonJofUxA&s`
    );
  
    await contractInstance.createFacility(
      "Fortis Hospital",
      "Maharashtra",
      "Mumbai",
      "Mulund-Goregaon Link Road",
      "400080",
      1, // AccessType.Private
      "A renowned healthcare provider offering comprehensive medical services to patients.",
      `https://cdn.apollohospitals.com/dev-apollohospitals/2022/05/apollo-proton_mobile-613c4b376e4c8-1-3.jpg`
    );
  
    await contractInstance.createFacility(
      "Medanta - The Medicity",
      "Haryana",
      "Gurugram",
      "Sector 38",
      "122001",
      0, // AccessType.Public
      "One of the largest multi-speciality hospitals in India, delivering world-class healthcare solutions.",
      `https://cdn.apollohospitals.com/dev-apollohospitals/2022/05/apollo-proton_mobile-613c4b376e4c8-1-3.jpg`
    );
  
    await contractInstance.createFacility(
      "Sri Ramachandra Medical Center",
      "Tamil Nadu",
      "Chennai",
      "Porur",
      "600116",
      1, // AccessType.Private
      "A leading healthcare institution providing exceptional medical treatments and services.",
      `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYYGIDP8sX1p40tsSvxK-3MaSTaoonJofUxA&s`
    );
  
    await contractInstance.createFacility(
      "Max Super Speciality Hospital",
      "Delhi",
      "New Delhi",
      "Saket",
      "110017",
      0, // AccessType.Public
      "A well-known hospital known for its expertise in various medical specialties and patient care.",
      `https://cdn.apollohospitals.com/dev-apollohospitals/2022/05/apollo-proton_mobile-613c4b376e4c8-1-3.jpg`
    );
  
    await contractInstance.createFacility(
      "Narayana Health City",
      "Karnataka",
      "Bengaluru",
      "Hosur Road",
      "560099",
      1, // AccessType.Private
      "A comprehensive healthcare facility offering a range of medical treatments and services.",
      `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYYGIDP8sX1p40tsSvxK-3MaSTaoonJofUxA&s`
    );
  
    await contractInstance.createFacility(
      "Aster Medcity",
      "Kerala",
      "Kochi",
      "Cheranelloor",
      "682027",
      0, // AccessType.Public
      "A state-of-the-art hospital providing advanced medical care with a focus on patient satisfaction.",
      `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYYGIDP8sX1p40tsSvxK-3MaSTaoonJofUxA&s`
    );
  
    await contractInstance.createFacility(
      "Artemis Hospitals",
      "Haryana",
      "Gurugram",
      "Sector 51",
      "122001",
      1, // AccessType.Private
      "An advanced healthcare facility equipped with modern technologies and skilled medical professionals.",
      `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYYGIDP8sX1p40tsSvxK-3MaSTaoonJofUxA&s`
    );
  
    await contractInstance.createFacility(
      "Manipal Hospital",
      "Karnataka",
      "Bengaluru",
      "Old Airport Road",
      "560017",
      0, // AccessType.Public
      "A trusted hospital offering comprehensive medical services with a commitment to quality care.",
      `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYYGIDP8sX1p40tsSvxK-3MaSTaoonJofUxA&s`
    );
  }
  
