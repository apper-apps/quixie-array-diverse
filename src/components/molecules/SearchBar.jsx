import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search quizzes...", className }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 text-gray-400"
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-24"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-2"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;