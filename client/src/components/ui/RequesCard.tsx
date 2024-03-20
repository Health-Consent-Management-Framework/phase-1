const ReportRequestsPage = ({ reportRequests }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold mb-4">Report Requests</h1>
        {reportRequests.length > 0 ? (
          <table className="w-full rounded-lg shadow mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-200 text-center">Doctor ID</th>
                <th className="px-4 py-2 bg-gray-200 text-center">Report ID</th>
                <th className="px-4 py-2 bg-gray-200 text-center">Date & Time</th>
                <th className="px-4 py-2 bg-gray-200 text-center">Message</th>
                <th className="px-4 py-2 bg-gray-200 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportRequests.map((request, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-2 text-center">{request.doctorId}</td>
                  <td className="px-4 py-2 text-center">{request.reportId}</td>
                  <td className="px-4 py-2 text-center">
                    {`${request.date} ${request.time}`}
                  </td>
                  <td className="px-4 py-2 text-center">{request.message}</td>
                  <td className="px-4 py-2 flex justify-center">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">Accept</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 font-bold">No report requests found.</p>
        )}
      </div>
    </div>
  );
};

export default ReportRequestsPage;
