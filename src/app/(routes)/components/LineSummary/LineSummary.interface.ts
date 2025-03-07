

export interface LineSummaryProps {
    line: string,
    color: string,
    status?: string,
    lastOrder: string,
    currentOrder: string,
    followingOrder: string,
    amountAct?:number,
    amountTgt?:number,
    throughputAct?: number,
    throughputTgt?: number,
    TooltipInfo?:{
        job_number:string,
        product_number: string,
        quantity_kg:number,
        consumption_kg_k:number,
        pml_target_g_m:number,
        width_mm:number,
        gusset_mm:number,
    }
}