import { useState } from 'react';
import { ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import type { Category } from '../types';

interface CategoryAccordionProps {
  categories: Category[];
  selectedCategoryId: number | 'ALL';
  onSelect: (id: number | 'ALL') => void;
}

export default function CategoryAccordion({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryAccordionProps) {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleOpen = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const isSelected = selectedCategoryId === category.id;
    const hasSubs = category.subCategories && category.subCategories.length > 0;
    const isOpen = openIds.includes(category.id);

    return (
      <div key={category.id} className="select-none">
        <div
          className={`
            flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all
            ${level > 0 ? 'ml-4 border-l border-gray-200 dark:border-gray-800' : ''}
            ${isSelected 
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'}
          `}
          onClick={() => {
            onSelect(category.id);
            if (hasSubs) toggleOpen(category.id);
          }}
        >
          {hasSubs ? (
            isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="w-4" />
          )}
          <span className="text-sm">{category.name}</span>
        </div>
        
        {hasSubs && isOpen && (
          <div className="mt-1">
            {category.subCategories!.map((sub) => renderCategory(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <div
        className={`
          flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all
          ${selectedCategoryId === 'ALL' 
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'}
        `}
        onClick={() => onSelect('ALL')}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm">Все услуги</span>
      </div>
      
      {categories.map((cat) => renderCategory(cat))}
    </div>
  );
}
