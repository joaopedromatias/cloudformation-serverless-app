import { Alert, Box, Card, Snackbar } from '@mui/material'
import Image from 'next/image'
import { Images } from '@/types'
import { DeleteOutline } from '@mui/icons-material/'
import { useEffect, useState } from 'react'

interface Props extends Images {
  image_group: number
}

export const ImageCard = ({ created_at, description, uri, title, image_group }: Props) => {
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false)
      }, 5000)
    }
  }, [showError])

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        backgroundColor: 'white',
        gap: 1.5
      }}
    >
      <Box sx={{ fontWeight: 'bold', margin: 'auto' }}>{title}</Box>
      <Box sx={{ width: '100%', minHeight: 250, position: 'relative', borderRadius: 2 }}>
        <Image
          style={{ borderRadius: '10px' }}
          src={uri}
          alt={description}
          fill={true}
          priority={true}
        />
      </Box>
      <Box sx={{ color: '#222' }}>{description}</Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Box sx={{ color: '#777' }}>
          Created at: {new Date(Number(created_at)).toISOString().split('T')[0]}
        </Box>
        <Box
          sx={{ cursor: 'pointer' }}
          onClick={async () => {
            try {
              await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ created_at: Number(created_at), image_group })
              })
              window.location.reload()
            } catch (err) {
              setShowError(true)
            }
          }}
        >
          <DeleteOutline />
        </Box>
        {showError && (
          <Alert severity="error">
            An error occurred while deleting the image, please try again
          </Alert>
        )}
      </Box>
    </Box>
  )
}
