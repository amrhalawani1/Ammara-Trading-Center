import { useState } from "react";
import { useImportCatalogContent, getListContentBrandsQueryKey, getListContentProductsQueryKey, getGetPublicCatalogQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UploadCloud } from "lucide-react";

export function ImportTab() {
  const [jsonInput, setJsonInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const importContent = useImportCatalogContent();

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!parsed.brands || !parsed.products) {
        toast({ title: "Invalid payload.", description: "JSON must have 'brands' and 'products' arrays.", variant: "destructive" });
        return;
      }
      
      importContent.mutate({ data: parsed }, {
        onSuccess: (result) => {
          toast({ 
            title: "Import Successful", 
            description: `Upserted ${result.brandsUpserted} brands, ${result.productsUpserted} products. Preserved ${result.preservedSlugs} slugs.` 
          });
          queryClient.invalidateQueries({ queryKey: getListContentBrandsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListContentProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPublicCatalogQueryKey() });
          setJsonInput("");
        },
        onError: () => {
          toast({ title: "Import failed.", description: "Check server logs for details.", variant: "destructive" });
        }
      });
      
    } catch (e) {
      toast({ title: "Invalid JSON format", description: "Please ensure the payload is valid JSON.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-display mb-2">Legacy Data Import</h2>
        <p className="text-muted-foreground font-light text-sm">
          Paste the legacy MySQL export JSON here. It must contain <code className="bg-accent px-1">brands</code> and <code className="bg-accent px-1">products</code> arrays matching the current schema. Existing slugs will be preserved to maintain SEO URLs.
        </p>
      </div>

      <div className="space-y-4">
        <Textarea 
          placeholder={'{\n  "brands": [\n    { "name": "Brand", "slug": "brand", ... }\n  ],\n  "products": []\n}'}
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          className="font-mono text-xs min-h-[400px] rounded-none border-border"
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleImport} 
            disabled={importContent.isPending || !jsonInput.trim()}
            className="rounded-none text-xs font-bold uppercase tracking-widest"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            {importContent.isPending ? "Importing..." : "Run Import"}
          </Button>
        </div>
      </div>
    </div>
  );
}
