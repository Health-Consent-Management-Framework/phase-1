import { Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { Button } from "./ui";
import { DownloadSharp, Print, RemoveRedEye, Done } from "@mui/icons-material";
import dummyReport from "../assets/dummyReport.jpg";
import useContract from "../hooks/useContract";
import {
  abi as ReportAbi,
  networks as ReportNetworks,
} from "../contracts/Report.json";
import { useCombinedContext } from "../store";
import { useTransaction } from "../hooks/useTransaction";
import { useCallback, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import AccessDoctors from "./ui/AccessDoctors";
import {
  abi as DoctorsAbi,
  networks as DoctorsNetworks,
} from "../contracts/Doctor.json";
import { useState } from "react";
import DiagnosisSection from "./report/diagnosisSection";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ViewReport = () => {
  const params = useParams();
  const reportContract = useContract(ReportAbi, ReportNetworks);
  const doctorContract = useContract(DoctorsAbi, DoctorsNetworks);
  const { selectedWallet } = useCombinedContext();
  // const [doctorsContract, setDoctorsContract] = useState(null);
  const [doctorsData, setDoctorsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); 
  const [id, setId] = useState('');

  function updateMenuOpen(event: React.MouseEvent<HTMLElement>, id: string) {
    setAnchorEl(event);
    setId(id);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
    setId("");
  };

  const revokeAccessfun = useCallback(async () => {
    console.log("revokeAccessfun called"); // Add this line
    try {
        const revokeAccessTx = await reportContract.methods.revokeDoctorAccessToPatient(params.id, id).send({ from: selectedWallet });
        console.log("Access revoked successfully");
    } catch (error) {
        console.error("Error revoking access:", error);
    }
}, [reportContract, params.id, id, selectedWallet]);

  const getReport = useCallback(async () => {
    const data = await reportContract?.methods
      .getReport(params.id)
      .call({ from: selectedWallet });
    console.log(data)
    return data;
  }, [reportContract]);

  const { loading, error, data: report } = useTransaction(getReport);

  useEffect(() => {
    console.log(report);
  }, [report]);


  const getDoctors = useCallback(
    async (doctorAddress) => {
      const doctorData = await doctorContract.methods
        .getDoctorInfo(doctorAddress)
        .call({ from: selectedWallet });
      return doctorData;
    },
    [doctorContract, selectedWallet]
  );

  const fetchDoctorsData = useCallback(async () => {
    let mergedData = [];
    for (const ele of report?.doctorAddress) {
      // console.log(ele);
      const doctorData = await getDoctors(ele);
      // console.log(doctorData);
      if (doctorData) {
        mergedData.push({...doctorData,walletAddress:ele});
      }
    }
    console.log(mergedData);
    setDoctorsData(mergedData);
  }, [report, getDoctors]);

  useEffect(() => {
    fetchDoctorsData();
  }, [fetchDoctorsData]);

  return (
    <section className="flex h-full flex-col ">
      <div className="px-10 py-3 w-full">
        <h1 className="text-lg font-medium ">
          Report:
          <span className="text-[#545454] px-1 font-medium">{params.id}</span>
        </h1>
      </div>
      <Divider />
      <div className="my-5 flex flex-col grow">
        {loading ? (
          <div className="w-screen flex items-center justify-center">
            <BeatLoader loading={loading} color="blue" />
          </div>
        ) : (
          <>
            <div className="px-5 mb-4" aria-labelledby="report-header-info">
              <div className="card border-2 rounded-md bg-[#F5F7FB] py-8 px-10 shadow-md w-full">
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center gap-2">
                    <article>
                      <img
                        src={report?.attachements[0]}
                        className="max-w-[200px] max-h-[100px] object-cover object-top"
                      />
                    </article>
                    <article className="items-start gap-2 flex flex-col">
                      <h1 className="font-semibold text-xl flex items-center justify-center">
                        Name:
                        <span className="font-light text-sm mx-2 tracking-wide text-gray-400">
                          {report?.problem}
                        </span>
                      </h1>
                      <h3 className="font-semibold text-xl flex items-center justify-center">
                        Date:
                        <span className="font-light text-sm mx-2 tracking-wide text-gray-400">
                          Uploaded Date
                        </span>
                      </h3>
                      <article>
                        <h6 className="font-semibold text-xl flex items-center justify-center">
                          Tags:
                          {report?.tags.map((ele, index) => (
                            <span
                              key={index}
                              className="font-medium text-sm p-1 mx-2 rounded-lg bg-gray-200"
                            >
                              {ele}
                            </span>
                          ))}
                        </h6>
                      </article>
                    </article>
                  </div>
                  <article className="max-w-[500px] flex gap-4 justify-center items-center flex-wrap">
                    <a target="_blank" href={report&&report?.attachements[0]}>
                      <Button className="border-gray-200 flex items-center gap-2 font-medium text-gray-500 hover:text-red-400">
                        <RemoveRedEye />
                        View
                      </Button>
                    </a>
                    {report && !report.isVerified && (
                      <Button className="border-gray-200 flex items-center gap-2 font-medium text-gray-500 hover:text-red-400">
                        <Done />
                        Request Verification
                      </Button>
                    )}
                    {/* {report && (
                      <Button className="border-gray-200 flex items-center gap-2 font-medium text-gray-500 hover:text-red-400">
                        View Requests
                      </Button>
                    )} */}
                  </article>
                </div>
              </div>
            </div>
            <div className="px-5 mb-4 flex flex-col grow">
              <div className="flex h-full items-center">
                <div className="w-1/2 rounded-md h-full p-2">
                  <DiagnosisSection/>
                </div>
                <div className="w-1/2 rounded-md h-full p-2">
                  <article className="border-2 w-full h-full rounded-md shadow-md bg-[#F5F7FB]">
                    <h1 className="font-medium ps-5 pb-2 pt-4 text-xl">
                      Doctors with access
                    </h1>
                    <Divider></Divider>
                    <Menu
                      anchorEl={anchorEl}
                      id="doctor-menu"
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={revokeAccessfun}>
                        Revoke access
                      </MenuItem>
                    </Menu>
                    {doctorsData.map((doctor, index) => (
                      <AccessDoctors key={index} doctorData={doctor} updateMenuOpen={updateMenuOpen} doctorAddress={doctor.walletAddress} />
                    ))}
                    {/* {report?.doctorAddress.map(ele=>(
                                            <p>{ele}</p>
                                        ))} */}
                    <p className="ps-5">No thing to worry</p>
                  </article>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ViewReport;
