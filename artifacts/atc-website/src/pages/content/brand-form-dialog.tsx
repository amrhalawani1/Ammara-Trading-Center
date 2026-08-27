import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateContentBrand, useUpdateContentBrand, getListContentBrandsQueryKey, getGetPublicCatalogQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import type { Brand, BrandInput } from "@workspace/api-client-react";

const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  country: z.string().optional(),
  category: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published", "comingSoon"]),
  legacyId: z.string().optional()
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormDialogProps {
  brand: Brand | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandFormDialog({ brand, open, onOpenChange }: BrandFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createBrand = useCreateContentBrand();
  const updateBrand = useUpdateContentBrand();

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      country: "",
      category: "",
      summary: "",
      description: "",
      coverImage: "",
      websiteUrl: "",
      isFeatured: false,
      status: "draft",
      legacyId: ""
    }
  });

  useEffect(() => {
    if (brand && open) {
      form.reset({
        name: brand.name,
        slug: brand.slug,
        country: brand.country || "",
        category: brand.category || "",
        summary: brand.summary || "",
        description: brand.description,
        coverImage: brand.coverImage || "",
        websiteUrl: brand.websiteUrl || "",
        isFeatured: brand.isFeatured,
        status: brand.status as any,
        legacyId: brand.legacyId || ""
      });
    } else if (!brand && open) {
      form.reset({
        name: "",
        slug: "",
        country: "",
        category: "",
        summary: "",
        description: "",
        coverImage: "",
        websiteUrl: "",
        isFeatured: false,
        status: "draft",
        legacyId: ""
      });
    }
  }, [brand, open, form]);

  const onSubmit = (data: BrandFormValues) => {
    // nullify empty strings for optionals
    const payload: BrandInput = {
      ...data,
      country: data.country || null,
      category: data.category || null,
      summary: data.summary || null,
      coverImage: data.coverImage || null,
      websiteUrl: data.websiteUrl || null,
      legacyId: data.legacyId || null
    };

    if (brand) {
      updateBrand.mutate({ id: brand.id, data: payload }, {
        onSuccess: () => {
          toast({ title: "Brand updated." });
          queryClient.invalidateQueries({ queryKey: getListContentBrandsQueryKey() });
          queryClient.invalidateQueries();
          onOpenChange(false);
        },
        onError: () => toast({ title: "Failed to update brand.", variant: "destructive" })
      });
    } else {
      createBrand.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Brand created." });
          queryClient.invalidateQueries({ queryKey: getListContentBrandsQueryKey() });
          queryClient.invalidateQueries();
          onOpenChange(false);
        },
        onError: () => toast({ title: "Failed to create brand.", variant: "destructive" })
      });
    }
  };

  const isPending = createBrand.isPending || updateBrand.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{brand ? "Edit Brand" : "New Brand"}</DialogTitle>
          <DialogDescription className="font-light">
            Fill out the details for this brand below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <Label>Brand Name</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem>
                  <Label>URL Slug</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <Label>Country of Origin</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <Label>Category (e.g. Hardware)</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="coverImage" render={({ field }) => (
              <FormItem>
                <Label>Cover Image URL</Label>
                <FormControl><Input {...field} className="rounded-none" placeholder="https://..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                <FormItem>
                  <Label>Manufacturer Website</Label>
                  <FormControl><Input {...field} className="rounded-none" placeholder="https://..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="legacyId" render={({ field }) => (
                <FormItem>
                  <Label>MySQL Legacy ID</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="summary" render={({ field }) => (
              <FormItem>
                <Label>Summary (Short)</Label>
                <FormControl><Input {...field} className="rounded-none" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <Label>Full Description</Label>
                <FormControl><Textarea {...field} className="rounded-none min-h-[120px]" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4 items-end">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <Label>Status</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none"><SelectValue placeholder="Select a status" /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="comingSoon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="isFeatured" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-none border border-border p-3">
                  <div className="space-y-0.5">
                    <Label>Featured Brand</Label>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-none">Cancel</Button>
              <Button type="submit" disabled={isPending} className="rounded-none">{brand ? "Save Changes" : "Create Brand"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
