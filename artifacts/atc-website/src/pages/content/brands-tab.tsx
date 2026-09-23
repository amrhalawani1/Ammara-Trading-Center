import { useState } from "react";
import { useListContentBrands, useDeleteContentBrand, getListContentBrandsQueryKey, getGetPublicCatalogQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { BrandFormDialog } from "./brand-form-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Brand } from "@workspace/api-client-react";

export function BrandsTab() {
  const { data: brands, isLoading, error } = useListContentBrands();
  const deleteBrand = useDeleteContentBrand();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedBrand(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId === null) return;
    deleteBrand.mutate({ id: pendingDeleteId }, {
      onSuccess: () => {
        toast({ title: "Brand deleted successfully." });
        queryClient.invalidateQueries({ queryKey: getListContentBrandsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetPublicCatalogQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to delete brand.", variant: "destructive" });
      },
      onSettled: () => setPendingDeleteId(null),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-none" />)}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Error loading brands.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display">Brand Management</h2>
        <Button onClick={handleCreate} className="rounded-none text-xs font-bold uppercase tracking-widest">
          <Plus className="w-4 h-4 mr-2" /> Add Brand
        </Button>
      </div>

      <div className="border border-border">
        {brands?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No brands found.</div>
        ) : (
          <div className="divide-y divide-border">
            {brands?.map(brand => (
              <div key={brand.id} className="p-4 flex items-center justify-between hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-4">
                  {brand.coverImage ? (
                    <img src={brand.coverImage} alt={brand.name} className="w-12 h-12 object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-wider">No Img</div>
                  )}
                  <div>
                    <h3 className="font-display text-lg leading-none mb-1">{brand.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>/{brand.slug}</span>
                      <span className={`px-2 py-0.5 border border-border uppercase tracking-widest text-[9px] font-bold ${brand.status === 'published' ? 'text-primary' : ''}`}>
                        {brand.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(brand)} className="rounded-none border-border">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(brand.id)} className="rounded-none border-border text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BrandFormDialog
        brand={selectedBrand}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this brand?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the brand from the catalogue. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
