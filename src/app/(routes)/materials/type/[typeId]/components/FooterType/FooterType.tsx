"use client"

import { useRouter } from "next/navigation";
import { FooterTypeProps } from "./FooterType.interface";
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

export function FooterType(props: FooterTypeProps) {
    const { typeId } = props;
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    
    const onDeleteType = async () => {
        try {
            setIsDeleting(true);
            const response = await axios.delete(`/api/type/${typeId}/delete`);
            
            // Si hay materiales afectados, mostrar un mensaje informativo
            if (response.data.affectedMaterials > 0) {
                toast({
                    title: "Type marked as deleted",
                    description: `${response.data.affectedMaterials} material(s) were using this type. They will continue to work normally.`,
                    duration: 5000
                });
            } else {
                toast({
                    title: "Type deleted successfully"
                });
            }
            
            router.refresh();
            router.push("/materials")
        } catch (error) {
            console.error("Error deleting type:", error);
            toast({
                title: "Failed to delete type",
                description: "An error occurred while trying to delete the type.",
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
                        {isDeleting ? "Deleting..." : "Remove Type"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will mark this type as deleted. It will no longer appear in 
                            the list of available types, but existing materials that use this type
                            will continue to work normally.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDeleteType}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}