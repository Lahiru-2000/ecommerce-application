import React from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  productCount: number;
  onAddProduct: () => void;
  canUndo: boolean;
  onUndo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  productCount,
  onAddProduct,
  canUndo,
  onUndo,
}) => {
  return (
    <header className="bg-blue-50 shadow-sm border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                Product Dashboard
              </h1>
              <p className="text-sm text-blue-400">
                {productCount} {productCount === 1 ? "product" : "products"} total
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {canUndo && (
              <Button
                // variant="outline"
                onClick={onUndo}
                className="hidden sm:flex"
              >
                Undo Delete
              </Button>
            )}
            <Button
              onClick={onAddProduct}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
