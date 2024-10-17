

const tableData = [
    { player: "0xcec2...658e", mints: 87, ranking: 15, earnings: "25,469" },
    { player: "0xcec2...a49a", mints: 72, ranking: 17, earnings: "25,469" },
];



export function DashboardTable() {
  return (
    <div className="bg-blue-500 p-2 lg:p-4 mt-4 rounded-lg text-white w-full">
        <table className="w-full text-left text-sm lg:text-lg p-2">
            <thead className="bg-[#1F2C46] rounded-md">
                <tr>
                    <th>No</th>
                    <th>Player</th>
                    <th>Number of mints</th>
                    <th>Holder ranking</th>
                    <th>Total earning </th>
                    <th>More details</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((row, index)=>{
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.player}</td>
                        <td>{row.mints}</td>
                        <td>{row.ranking}</td>
                        <td>{row.earnings}</td>
                        <td>
                        <a href="#" className="text-blue-400">more</a>
                        </td>
                    </tr>
                })}
            </tbody>

        </table>
    </div>
  )
}
