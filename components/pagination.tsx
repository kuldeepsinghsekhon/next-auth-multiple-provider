import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
const PAGE_SIZES = [10, 25, 50, 100]
export function Pagination({
  currentPage,
  totalPages,
  //pageSize,
 // onPageChange,
 // onPageSizeChange
}: {
  currentPage: number
  totalPages: number
  //pageSize: number
 // onPageChange: (page: number) => void
 // onPageSizeChange: (size: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Items per page</p>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue>{pageSize}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
