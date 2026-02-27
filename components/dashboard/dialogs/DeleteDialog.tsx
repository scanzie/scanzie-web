"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash, XIcon } from "lucide-react";

const DeleteDialog = ({
  deleteOpen,
  setDeleteOpen,
  deleteLoading,
  setDeleteLoading,
  handleDelete,
}: {
  deleteOpen: boolean;
  deleteLoading: boolean;
  setDeleteOpen: (open: boolean) => void;
  setDeleteLoading: (open: boolean) => void;
  handleDelete: () => void;
}) => {
  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <span>SEO Analysis Progress</span>
            <XIcon
              onClick={() => setDeleteOpen(false)}
              className="h-9 w-9 p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
            />
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="my-4 mx-auto md:max-w-sm text-center">
          <h2 className="text-3xl font-bold mb-2">Delete this</h2>
          <p>
            Are you sure you want to delete this analysis. The moment this
            analysis, it cannot be retrieved.
          </p>
        </div>

        <div className="mx-auto flex items-center gap-4">
          <Button
            onClick={() => setDeleteLoading(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors duration-200"
          >
            <span>Cancel</span>
          </Button>
          <Button
            disabled={deleteLoading}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
          >
            {deleteLoading ?
              <Loader2Icon className="animate-spin" />
            : <Trash className="" />}
            <span>{deleteLoading ? "Deleting" : "Delete anyway"}</span>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
