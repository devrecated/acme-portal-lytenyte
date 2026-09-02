"use client"

import { Grid, useClientDataSource } from "@1771technologies/lytenyte-core"
import "@1771technologies/lytenyte-core/grid-full.css"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { useCallback, useMemo, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  /** Supply to make the column sortable. */
  sortValue?: (row: T) => string | number
  className?: string
  headerClassName?: string
  width?: number
  widthFlex?: number
}

type SortDirection = "asc" | "desc"

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  isLoading?: boolean
  emptyState?: ReactNode
  initialSort?: { key: string; direction: SortDirection }
  rowHeight?: number
}

interface GridSpec<T> {
  readonly data: T
}

export function DataTable<T extends object>({
  columns,
  rows,
  getRowId,
  onRowClick,
  isLoading,
  emptyState,
  initialSort,
  rowHeight = 44,
}: DataTableProps<T>) {
  const [sort, setSort] = useState(initialSort)

  const sortFn = useMemo(() => {
    if (!sort) return null
    const column = columns.find((candidate) => candidate.key === sort.key)
    if (!column?.sortValue) return null
    const read = column.sortValue
    const direction = sort.direction === "asc" ? 1 : -1
    return ((left, right) => {
      if (left.kind !== "leaf" || right.kind !== "leaf") return 0
      const a = read(left.data)
      const b = read(right.data)
      if (typeof a === "number" && typeof b === "number") {
        return (a - b) * direction
      }
      return String(a).localeCompare(String(b)) * direction
    }) as Grid.T.SortFn<T>
  }, [columns, sort])

  const leafIdFn = useCallback(
    (row: T) => getRowId(row),
    [getRowId],
  )

  const ds = useClientDataSource<T>({
    data: isLoading ? [] : rows,
    sort: sortFn,
    leafIdFn,
  })

  const gridColumns = useMemo<Grid.Column<GridSpec<T>>[]>(
    () =>
      columns.map((column, index) => ({
        id: column.key,
        name: column.header,
        width: column.width ?? (index === 0 ? 140 : 180),
        widthFlex: column.widthFlex ?? (index === 1 ? 1 : 0),
        field: ({ row }) =>
          row.kind === "leaf" && column.sortValue
            ? column.sortValue(row.data)
            : column.key,
        headerRenderer: function HeaderCell() {
          return (
            <button
              type="button"
              disabled={!column.sortValue}
              onClick={() => {
                if (!column.sortValue) return
                setSort((current) =>
                  current?.key === column.key
                    ? {
                        key: column.key,
                        direction: current.direction === "asc" ? "desc" : "asc",
                      }
                    : { key: column.key, direction: "asc" },
                )
              }}
              className={cn(
                "inline-flex h-full w-full items-center gap-1 font-medium",
                column.headerClassName,
                column.sortValue
                  ? "cursor-pointer hover:text-foreground"
                  : "cursor-default",
              )}
            >
              {column.header}
              {column.sortValue ? (
                <SortIcon
                  active={sort?.key === column.key}
                  direction={sort?.direction}
                />
              ) : null}
            </button>
          )
        },
        cellRenderer: function Cell({
          api,
          row,
        }: Grid.T.CellRendererParams<GridSpec<T>>) {
          if (!api.rowIsLeaf(row) || !row.data) return null
          return (
            <div className={cn("flex h-full w-full items-center", column.className)}>
              {column.cell(row.data)}
            </div>
          )
        },
      })),
    [columns, sort],
  )

  const events = useMemo<Grid.Events<GridSpec<T>>>(
    () => ({
      cell: {
        click: ({ row, api }) => {
          if (!onRowClick || !api.rowIsLeaf(row) || !row.data) return
          onRowClick(row.data)
        },
      },
      row: {
        click: ({ row, api }) => {
          if (!onRowClick || !api.rowIsLeaf(row) || !row.data) return
          onRowClick(row.data)
        },
      },
    }),
    [onRowClick],
  )

  const headerHeight = 40
  const minBody = 220
  const maxHeight = 640
  const body = isLoading
    ? minBody
    : rows.length === 0
      ? minBody
      : Math.min(maxHeight - headerHeight, rows.length * rowHeight)
  const height = headerHeight + body

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="ln-grid ln-dark relative" style={{ height }}>
        <Grid<GridSpec<T>>
          columns={gridColumns}
          rowSource={ds}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          events={events}
          virtualizeRows={rows.length > 40}
          viewportInitialHeight={height}
          columnSizeToFit
        />
        {isLoading ? (
          <div className="absolute inset-0 z-10 animate-pulse bg-muted/40" />
        ) : null}
        {!isLoading && rows.length === 0 ? (
          <div className="absolute inset-x-0 bottom-0 top-10 z-10 flex items-center justify-center bg-card">
            {emptyState ?? (
              <p className="text-sm text-muted-foreground">Nothing to show yet.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean
  direction?: SortDirection
}) {
  if (!active) {
    return <ChevronsUpDown className="size-3.5 text-muted-foreground/60" />
  }
  return direction === "asc" ? (
    <ArrowUp className="size-3.5" />
  ) : (
    <ArrowDown className="size-3.5" />
  )
}
