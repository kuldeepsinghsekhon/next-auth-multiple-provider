'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSearch } from '@/hooks/use-search'
export function ItemLimit(){
    const {isPending,  handleLimit, currentLimit } = useSearch()

    return(
        <Select
        value={currentLimit}
        onValueChange={handleLimit}
        disabled={isPending}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="# per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
          <SelectItem value="100">100 per page</SelectItem>
        </SelectContent>
      </Select>
    )
}