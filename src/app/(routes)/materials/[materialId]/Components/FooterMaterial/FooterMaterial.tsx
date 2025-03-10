"use client"

import { useRouter } from "next/navigation";
import { FooterMaterialProps } from "./FooterMaterial.interface";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function FooterMaterial(props: FooterMaterialProps) {
    const { materialId } = props;
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    
    const onDeleteMaterial = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`/api/material/${materialId}/delete`);
            
            toast({
                title: "Material deleted successfully",
                description: "The material has been marked as deleted and will no longer appear in lists."
            });
            
            router.push("/materials");
            router.refresh();
        } catch (error) {
            console.error("Error deleting material:", error);
            toast({
                title: "Failed to delete material",
                description: "An error occurred while trying to delete the material.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex justify-end mt-5">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                        <Trash className="w-4 h-4 mr-2"/>
                        {isDeleting ? "Deleting..." : "Remove Material"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will mark this material as deleted. It will no longer appear in 
                            the list of available materials. This action can be reversed by a database administrator.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDeleteMaterial}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}




