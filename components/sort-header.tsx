'use client';

import {
  TableHead
} from '@/components/ui/table-advance';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useSearch } from '@/hooks/use-search';
export function SortHeader({ field, children }: { field: string, children: React.ReactNode }){
      const { handleSort, sortField, sortOrder } = useSearch()
    return(
              <TableHead 
                className="cursor-pointer hover:bg-gray-50" 
                onClick={() => handleSort(field)}
              >
                <div className="flex items-center gap-2">
                  {children}
                  <div className="w-4">
                    {sortField === field ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                </div>
              </TableHead>
    )
}