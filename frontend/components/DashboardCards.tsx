import { DashboardCardItem } from "./DashboardCardItem"


export function DashboardCards () {
    return (
        <article className="grid grid-cols-3 p-6 gap-6">
            <DashboardCardItem title="Holder Ranking" value={25} total={35060} />
            <DashboardCardItem title="Total Battle Passes" value={69} total={50149} />
            <DashboardCardItem title="Total Redeemed" value={17} total={6285} />
        </article>
        
    )
}