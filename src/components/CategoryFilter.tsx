import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  gridSize,
  setGridSize
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
      <div className="flex gap-2 min-w-max">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={`
              whitespace-nowrap transition-all duration-300
              ${selectedCategory === category 
                ? 'gradient-primary text-white hover:opacity-90' 
                : 'hover:border-primary'
              }
            `}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-3 ml-4">
        <Icon name="LayoutGrid" size={20} className="text-muted-foreground" />
        <Slider
          value={[gridSize]}
          onValueChange={(value) => setGridSize(value[0])}
          min={2}
          max={6}
          step={1}
          className="w-32"
        />
      </div>
    </div>
  );
}
