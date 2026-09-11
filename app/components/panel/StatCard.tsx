type styleColors = "red" | "neutral" | "green" | "purple";

interface StatCardProps {
    value: number;
    description: string;
    style: styleColors
}

export default function StatCard(props: StatCardProps) {
  return (
    <div className={`flex flex-col px-5 py-2 w-44 h-24 bg-${props.style}-500 border border-neutral-600 rounded-2xl`}>
        <p className={`text-xs text-${props.style}-200 font-stretch-expanded`}>{props.description}</p>
        <p className={`text-4xl text-white font-semibold`}>{props.value}</p>
    </div>
  )
}
