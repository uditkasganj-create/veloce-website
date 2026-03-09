import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useFetch';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  initialFilters?: Partial<FilterState>;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
  order: 'asc' | 'desc';
}

const PRICE_RANGE = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹4,000', min: 2000, max: 4000 },
  { label: '₹4,000 - ₹6,000', min: 4000, max: 6000 },
  { label: '₹6,000 - ₹8,000', min: 6000, max: 8000 },
  { label: 'Above Rs. 8,000', min: 8000, max: 100000 },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name: A-Z' },
];

export function SearchFilters({
  onSearch,
  onFilterChange,
  categories,
  initialFilters
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters?.search || '');
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search || '',
    category: initialFilters?.category || '',
    minPrice: initialFilters?.minPrice || 0,
    maxPrice: initialFilters?.maxPrice || 100000,
    sort: initialFilters?.sort || 'createdAt',
    order: initialFilters?.order || 'desc',
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: prev.category === category ? '' : category }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: prev.minPrice === min && prev.maxPrice === max ? 0 : min,
      maxPrice: prev.minPrice === min && prev.maxPrice === max ? 100000 : max,
    }));
  };

  const handleSortChange = (sort: string) => {
    const [field, order] = sort.startsWith('-')
      ? [sort.slice(1), 'desc']
      : [sort, 'asc'];
    setFilters(prev => ({ ...prev, sort: field, order: order as 'asc' | 'desc' }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 100000,
      sort: 'createdAt',
      order: 'desc',
    });
  };

  const hasActiveFilters = filters.category || filters.minPrice > 0 || filters.search;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-6 py-4 rounded-full border transition-all",
            isOpen || hasActiveFilters
              ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
              : "border-gray-200 dark:border-gray-700 hover:border-brand-orange"
          )}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center">
              !
            </span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif italic text-xl">Filter Products</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-brand-orange hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    filters.category === category
                      ? "bg-brand-orange text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-orange"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">Price Range</h4>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGE.map(range => (
                <button
                  key={range.label}
                  onClick={() => handlePriceChange(range.min, range.max)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    filters.minPrice === range.min && filters.maxPrice === range.max
                      ? "bg-brand-orange text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-orange"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    filters.sort === option.value.replace('-', '')
                      ? "bg-brand-orange text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-orange"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
