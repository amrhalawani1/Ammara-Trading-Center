import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateContentProduct, useUpdateContentProduct, useListContentBrands, getListContentProductsQueryKey, getGetPublicCatalogQueryKey } from "@workspace/api-client-react";
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
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import type { Product, ProductInput } from "@workspace/api-client-react";

const specSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1)
});

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  brandSlug: z.string().min(1, "Brand is required"),
  sku: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  family: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  // Kept as plain comma-separated strings in the form itself (split into
  // string[] in onSubmit, not via a zod .transform() here) — a transform
  // makes the form's input type and its resolved output type diverge, which
  // doesn't play well with react-hook-form's zodResolver type inference.
  images: z.string().default(""),
  material: z.string().optional(),
  finish: z.string().optional(),
  dimensions: z.string().optional(),
  specs: z.array(specSchema).default([]),
  finishes: z.string().default(""),
  installationNotes: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published", "comingSoon", "retired"]),
  legacyId: z.string().optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

function splitCommaList(value: string): string[] {
  return value ? value.split(',').map(s => s.trim()) : [];
}

interface ProductFormDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductFormDialog({ product, open, onOpenChange }: ProductFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createProduct = useCreateContentProduct();
  const updateProduct = useUpdateContentProduct();
  const { data: brands } = useListContentBrands();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      brandSlug: "",
      sku: "",
      category: "",
      family: "",
      description: "",
      image: "",
      images: "",
      material: "",
      finish: "",
      dimensions: "",
      specs: [],
      finishes: "",
      installationNotes: "",
      isFeatured: false,
      status: "draft",
      legacyId: ""
    }
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: "specs"
  });

  useEffect(() => {
    if (product && open) {
      form.reset({
        title: product.title,
        slug: product.slug,
        brandSlug: product.brandSlug,
        sku: product.sku || "",
        category: product.category,
        family: product.family || "",
        description: product.description,
        image: product.image || "",
        images: product.images?.join(", ") || "",
        material: product.material || "",
        finish: product.finish || "",
        dimensions: product.dimensions || "",
        specs: product.specs || [],
        finishes: product.finishes?.join(", ") || "",
        installationNotes: product.installationNotes || "",
        isFeatured: product.isFeatured,
        status: product.status as ProductFormValues["status"],
        legacyId: product.legacyId || ""
      });
    } else if (!product && open) {
      form.reset({
        title: "",
        slug: "",
        brandSlug: "",
        sku: "",
        category: "",
        family: "",
        description: "",
        image: "",
        images: "",
        material: "",
        finish: "",
        dimensions: "",
        specs: [],
        finishes: "",
        installationNotes: "",
        isFeatured: false,
        status: "draft",
        legacyId: ""
      });
    }
  }, [product, open, form]);

  const onSubmit = (data: ProductFormValues) => {
    const payload: ProductInput = {
      title: data.title,
      slug: data.slug,
      brandSlug: data.brandSlug,
      category: data.category,
      description: data.description,
      specs: data.specs,
      finishes: splitCommaList(data.finishes),
      images: splitCommaList(data.images),
      isFeatured: data.isFeatured,
      status: data.status,
      
      sku: data.sku || null,
      family: data.family || null,
      image: data.image || null,
      material: data.material || null,
      finish: data.finish || null,
      dimensions: data.dimensions || null,
      installationNotes: data.installationNotes || null,
      legacyId: data.legacyId || null
    };

    if (product) {
      updateProduct.mutate({ id: product.id, data: payload }, {
        onSuccess: () => {
          toast({ title: "Product updated." });
          queryClient.invalidateQueries({ queryKey: getListContentProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPublicCatalogQueryKey() });
          onOpenChange(false);
        },
        onError: () => toast({ title: "Failed to update product.", variant: "destructive" })
      });
    } else {
      createProduct.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Product created." });
          queryClient.invalidateQueries({ queryKey: getListContentProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPublicCatalogQueryKey() });
          onOpenChange(false);
        },
        onError: () => toast({ title: "Failed to create product.", variant: "destructive" })
      });
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{product ? "Edit Product" : "New Product"}</DialogTitle>
          <DialogDescription className="font-light">
            Fill out the product catalog details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <Label>Product Title</Label>
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
              <FormField control={form.control} name="brandSlug" render={({ field }) => (
                <FormItem>
                  <Label>Brand</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none"><SelectValue placeholder="Select a brand" /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none">
                      {brands?.map(b => (
                        <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <Label>Category</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <Label>Description</Label>
                <FormControl><Textarea {...field} className="rounded-none min-h-[100px]" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <Label>Primary Image URL</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem>
                  <Label>SKU</Label>
                  <FormControl><Input {...field} className="rounded-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="images" render={({ field }) => (
              <FormItem>
                <Label>Additional Image URLs (comma separated)</Label>
                <FormControl><Input {...field} className="rounded-none" placeholder="https://... , https://..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="finishes" render={({ field }) => (
              <FormItem>
                <Label>Available Finishes (comma separated)</Label>
                <FormControl><Input {...field} className="rounded-none" placeholder="Matte Black, Brushed Brass" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="family" render={({ field }) => (
                <FormItem><Label>Product Family</Label><FormControl><Input {...field} className="rounded-none" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="material" render={({ field }) => (
                <FormItem><Label>Material</Label><FormControl><Input {...field} className="rounded-none" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="finish" render={({ field }) => (
                <FormItem><Label>Primary Finish</Label><FormControl><Input {...field} className="rounded-none" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dimensions" render={({ field }) => (
                <FormItem><Label>Dimensions</Label><FormControl><Input {...field} className="rounded-none" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="installationNotes" render={({ field }) => (
              <FormItem><Label>Installation Notes</Label><FormControl><Textarea {...field} className="rounded-none min-h-[80px]" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="legacyId" render={({ field }) => (
              <FormItem><Label>MySQL Legacy ID</Label><FormControl><Input {...field} className="rounded-none" /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="space-y-4 border border-border p-4 bg-accent/5">
              <div className="flex justify-between items-center">
                <Label className="text-base font-display">Technical Specifications</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => appendSpec({ label: "", value: "" })} className="rounded-none border-border">
                  <Plus className="w-3 h-3 mr-2" /> Add Spec
                </Button>
              </div>
              
              {specFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <FormField control={form.control} name={`specs.${index}.label`} render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl><Input {...field} placeholder="Label (e.g. Dimensions)" className="rounded-none" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`specs.${index}.value`} render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl><Input {...field} placeholder="Value" className="rounded-none" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="button" variant="outline" onClick={() => removeSpec(index)} className="rounded-none border-border text-destructive shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

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
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="isFeatured" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-none border border-border p-3 bg-background">
                  <div className="space-y-0.5">
                    <Label>Featured Product</Label>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-none">Cancel</Button>
              <Button type="submit" disabled={isPending} className="rounded-none">{product ? "Save Changes" : "Create Product"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
