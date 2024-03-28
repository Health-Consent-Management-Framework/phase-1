const Doctor = artifacts.require("Doctor")

module.exports = async function (deployer) {
    const doctorsRegistryInstance = await Doctor.deployed();
    const names = [
      { fname: "John", lname: "Smith", address:`0x96561feB8eaC4c7e85c15074A10CFC71175411cf` },
      { fname: "Emily", lname: "Johnson", address:`0x22C4576Cf9B2fbC65b180f0755Bfa1500D9D3D8d` },
      { fname: "Michael", lname: "Williams",address:`0x0c83b98b907fe9B3F3C4471479e751bDb77DCfc7` },
      { fname: "Sophia", lname: "Brown",address:`0xdf990b06fdeB0Fbc4F0c965c5d263c45667dbc70` },
      { fname: "William", lname: "Jones",address:`0x3EEac07801822Dc210741362AFBa838c87bA8FAC` },
      { fname: "Olivia", lname: "Garcia",address:`0x1F952235B3537D3500d795B49575dF454e2675a7` },
      { fname: "James", lname: "Martinez",address:`0x42e94930AD4874fA726f36Bc1EA2739FEF155555` },
      { fname: "Isabella", lname: "Hernandez",address:`0x512B661562673547970D1849B71Fa1fD7aEFf602` },
      { fname: "Benjamin", lname: "Young",address:`0xa82727d9d2Dc8138031A2fcfba88b313A4E1fD61` },
      { fname: "Charlotte", lname: "Scott",address:`0x97bC7A26C3629839b5CfE5B3C48d059DaB348aF1` }
    ];
  
    for (let i = 0; i < names.length; i++) {
      const email = `${names[i].fname.toLowerCase()}.${names[i].lname.toLowerCase()}@example.com`;
      const mobileNo = `+123456789${i}`;
      const designation = ["Cardiologist", "Pediatrician", "Neurologist", "Oncologist", "Orthopedic Surgeon"][i % 5]; // Types of doctors
      const degree = ["MD", "MBBS"];
      const DoB = Math.floor(new Date(`${1990 + i}-01-01`).getTime() / 1000); // Set different birth dates (1 year difference)
    //   const walletAddress = web3.utils.toChecksumAddress(`0x12345678901234567890123456789012345678${i}`); // Dummy wallet address
      await doctorsRegistryInstance.createDoctorDummy(names[i].fname, names[i].lname, email, mobileNo, designation, degree, DoB, names[i].address);
    }
  };
  