import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ categories, onCategoryChange, className }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const allCategories = ["All", ...categories];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {allCategories.map((category) => (
        <motion.div
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedCategory === category ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className="text-sm"
          >
            {category}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryFilter;