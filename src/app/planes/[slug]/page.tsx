

export default async function PlanePage({params}:{params:Promise<{slug:string}>}){
    const { slug } = await params
    return(
        <div className="w-full h-full text-white">
            {slug}
        </div>
    )
}