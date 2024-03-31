'use client'
import { Box, Button, Pagination, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import { ImageCard } from './components/ImageCard'
import { Images } from '@/types'
import { BaseCard } from './components/BaseCard'
import { ImagesPagination } from './components/Pagination'
import { AddImageDialog } from './components/AddImageDialog'

export default function Home() {
  const [imagesData, setImagesData] = useState<Images[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const maxItemsOnPage = 20

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '?page=' + currentPage)
      .then((response) => response.json())
      .then(({ data: { images, totalPages } }) => {
        setImagesData(images)
        setNumberOfPages(totalPages)
        setIsLoading(false)
      })
  }, [currentPage])

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage)
    setIsLoading(true)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0
        }}
      >
        {numberOfPages > 0 && (
          <ImagesPagination numberOfPages={numberOfPages} onPageChange={onPageChange} />
        )}
        <ul
          role="images list"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            flexWrap: 'wrap',
            padding: 0,
            margin: 0
          }}
        >
          {imagesData === null ? (
            <></>
          ) : isLoading ? (
            new Array(maxItemsOnPage).fill(null).map((_, i) => {
              return (
                <BaseCard key={i}>
                  <Skeleton key={i} variant="rounded" width={'inhertit'} height={350} />
                </BaseCard>
              )
            })
          ) : (
            imagesData.map((image, i) => {
              return (
                <BaseCard key={i}>
                  <ImageCard {...image} />
                </BaseCard>
              )
            })
          )}
          <BaseCard boxShadow={false}>
            <Box
              sx={{
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: 'auto'
              }}
            >
              <Box sx={{ margin: 'auto' }}>
                <Button onClick={() => setIsAddDialogOpen(true)} role="open add image dialog">
                  add image
                </Button>
              </Box>
            </Box>
          </BaseCard>
        </ul>
      </Box>
      {isAddDialogOpen && <AddImageDialog setIsAddDialogOpen={setIsAddDialogOpen} />}
    </>
  )
}
