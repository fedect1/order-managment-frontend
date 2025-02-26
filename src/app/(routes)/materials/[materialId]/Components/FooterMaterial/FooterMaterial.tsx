"use client"


import { useRouter } from "next/navigation";
import { FooterMaterialProps } from "./FooterMaterial.interface";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export function FooterMaterial(props: FooterMaterialProps) {
    const { materialId } = props
    const router = useRouter()

    const onDeleteMaterial = async () => {
        try {
            axios.delete(`/api/material/${materialId}`)
            toast({
                title: "Material deleted"
            })
            router.push("/materials")
        } catch (e) {
            toast({
                title: "Something went wrong",
                variant: "destructive",
            })
            console.log(e)
        }
    }
  return (
    <div className="flex justify-end mt-5">
        <Button variant="destructive" onClick={onDeleteMaterial}>
            <Trash className="w-4 h-4 mr-2"/>
            Remove Material
        </Button>
    </div>
  )
}
