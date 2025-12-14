import React, { memo, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import type { Product } from "../types/product";
import { formatPrice, truncateText } from "../utils/validation";
import { LOW_STOCK_THRESHOLD } from "../constants";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  showSelection?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = memo(
  ({
    product,
    onEdit,
    onDelete,
    isSelected = false,
    onSelectionChange,
    showSelection = false,
  }) => {
    const [imageError, setImageError] = useState(false);

    const getStockStatus = () => {
      if (product.stock === 0)
        return { label: "Out of Stock", variant: "destructive" as const };
      if (product.stock < LOW_STOCK_THRESHOLD)
        return { label: "Low Stock", variant: "secondary" as const };
      return { label: "In Stock", variant: "default" as const };
    };

    const stockStatus = getStockStatus();
    const fallbackImage =
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&auto=format";

    return (
      <Card className="group hover:shadow-lg hover:border-blue-400 transition-all duration-200 relative min-h-[532px]">
        {showSelection && (
          <div className="absolute top-3 left-3 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked: boolean) =>
                onSelectionChange?.(product.id, checked as boolean)
              }
              className="bg-white shadow-sm"
            />
          </div>
        )}

        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
            <img
              src={
                imageError ? fallbackImage : product.imageUrl || fallbackImage
              }
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              width={300}
              height={300}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight text-blue-800">
              {truncateText(product.name, 30)}
            </h3>
            <Badge variant={stockStatus.variant} className="ml-2 shrink-0 bg-blue-100 text-blue-700">
              {stockStatus.label}
            </Badge>
          </div>

          <p className="text-2xl font-bold text-blue-600 mb-2">
            {formatPrice(product.price)}
          </p>

          <div className="flex justify-between text-sm text-blue-500 mb-3">
            <span className="bg-blue-100 px-2 py-1 rounded-md">
              {product.category}
            </span>
            <span>Stock: {product.stock}</span>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {truncateText(product.description, 80)}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";
