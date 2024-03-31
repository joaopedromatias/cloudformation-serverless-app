import { Pagination } from '@mui/material'

interface Props {
  numberOfPages: number
  onPageChange: (newPage: number) => void
}

export const ImagesPagination = ({ numberOfPages, onPageChange }: Props) => {
  return (
    <Pagination
      count={numberOfPages}
      color="primary"
      onChange={(_, newPage) => {
        onPageChange(newPage)
      }}
    />
  )
}
