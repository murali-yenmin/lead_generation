
'use client';

import { Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from './button';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: FilterOption[];
}

interface ActionProps {
    label: string;
    onClick: () => void;
}

interface DataTableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: FilterProps[];
  actions?: ActionProps[];
}

export function DataTableToolbar({
  searchTerm,
  onSearchChange,
  filters = [],
  actions = [],
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {filters.map((filter, index) => (
            <Select key={index} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {filter.options.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        ))}
         {actions.map((action, index) => (
          <Button key={index} onClick={action.onClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
