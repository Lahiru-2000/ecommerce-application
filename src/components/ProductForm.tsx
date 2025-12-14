import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Product, ProductFormData } from "../types/product";
import {
  validateProductForm,
  type ValidationErrors,
} from "../utils/validation";
import { CATEGORIES, VALIDATION_RULES } from "../constants";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const newErrors = validateProductForm({ ...formData, [field]: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateProductForm(formData);
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProductForm(formData);
    setErrors(validationErrors);
    setTouched({
      name: true,
      price: true,
      category: true,
      stock: true,
      description: true,
      imageUrl: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      imageUrl: "",
    });
    setErrors({});
    setTouched({});
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.name &&
    formData.price &&
    formData.category &&
    formData.stock;

  const remainingChars =
    VALIDATION_RULES.description.maxLength - formData.description.length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Enter product name"
              className={
                errors.name && touched.name ? "border-destructive" : ""
              }
            />
            {errors.name && touched.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                onBlur={() => handleBlur("price")}
                placeholder="0.00"
                className={
                  errors.price && touched.price ? "border-destructive" : ""
                }
              />
              {errors.price && touched.price && (
                <p className="text-sm text-destructive mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={
                    errors.category && touched.category
                      ? "border-destructive"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && touched.category && (
                <p className="text-sm text-destructive mt-1">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Stock Quantity */}
          <div>
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              onBlur={() => handleBlur("stock")}
              placeholder="0"
              className={
                errors.stock && touched.stock ? "border-destructive" : ""
              }
            />
            {errors.stock && touched.stock && (
              <p className="text-sm text-destructive mt-1">{errors.stock}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              onBlur={() => handleBlur("imageUrl")}
              placeholder="https://example.com/image.jpg"
              className={
                errors.imageUrl && touched.imageUrl ? "border-destructive" : ""
              }
            />
            {errors.imageUrl && touched.imageUrl && (
              <p className="text-sm text-destructive mt-1">{errors.imageUrl}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="Enter product description"
              rows={3}
              className={
                errors.description && touched.description
                  ? "border-destructive"
                  : ""
              }
            />
            <div className="flex justify-between mt-1">
              {errors.description && touched.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <p
                className={`text-sm ml-auto ${
                  remainingChars < 20
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {remainingChars} characters remaining
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="flex-1"
            >
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
