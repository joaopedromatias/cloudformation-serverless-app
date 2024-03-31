import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Snackbar
} from '@mui/material'
import Image from 'next/image'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { ImagesPagination } from './Pagination'

interface Props {
  setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>
}

enum AddImageSteps {
  SELECT_IMAGE,
  ADD_METADATA
}

export const AddImageDialog = ({ setIsAddDialogOpen }: Props) => {
  const [step, setStep] = useState(AddImageSteps.SELECT_IMAGE)
  const [imagesArr, setImagesArr] = useState([] as string[])
  const [imagesFileArr, setImagesFileArr] = useState([] as File[])

  if (step === AddImageSteps.SELECT_IMAGE) {
    return (
      <FirstStep
        setImagesFileArr={setImagesFileArr}
        setImagesArr={setImagesArr}
        setIsAddDialogOpen={setIsAddDialogOpen}
        setStep={setStep}
      />
    )
  }

  if (step === AddImageSteps.ADD_METADATA) {
    return (
      <SecondStep
        imagesArr={imagesArr}
        setIsAddDialogOpen={setIsAddDialogOpen}
        imagesFileArr={imagesFileArr}
      />
    )
  }
}

interface FirstStepProps {
  setImagesFileArr: Dispatch<SetStateAction<File[]>>
  setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>
  setImagesArr: Dispatch<SetStateAction<string[]>>
  setStep: Dispatch<SetStateAction<AddImageSteps>>
}

const FirstStep = ({
  setIsAddDialogOpen,
  setImagesArr,
  setStep,
  setImagesFileArr
}: FirstStepProps) => {
  const [numberOfImages, setNumberOfImages] = useState(0)

  const handlesubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const images = (document.getElementById('files') as HTMLInputElement).files
    if (images) {
      const imagesArr = []
      const imagesFileArr = []
      for (let i = 0; i < images.length; i++) {
        imagesFileArr.push(images[i])
        const image = URL.createObjectURL(images[i])
        imagesArr.push(image)
      }
      setImagesFileArr(imagesFileArr)
      setImagesArr(imagesArr)
      setStep(AddImageSteps.ADD_METADATA)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target
    setNumberOfImages(files.files?.length || 0)
  }

  return (
    <Dialog
      open={true}
      onClose={() => setIsAddDialogOpen(false)}
      aria-labelledby="select images"
      aria-describedby="dialog to select images to upload"
    >
      <form onSubmit={handlesubmit}>
        <DialogTitle>Select images</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>You have selected {numberOfImages} files</Box>
            <input
              max={10}
              id="files"
              onChange={handleFileChange}
              type="file"
              multiple
              accept="image/png, image/jpg"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button disabled={numberOfImages === 0} type="submit" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface SecondStepProps {
  setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>
  imagesArr: string[]
  imagesFileArr: File[]
}

const SecondStep = ({ imagesArr, setIsAddDialogOpen, imagesFileArr }: SecondStepProps) => {
  const numberOfPages = imagesArr.length
  const [currentPage, setCurrentPage] = useState(0)
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false)
      }, 5000)
    }
  }, [showError])

  const handleFormChange = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    let allow = true
    formData.forEach((value, key) => {
      if (!value) allow = false
    })
    setAllowSubmit(allow)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    let hadError = false

    try {
      for (let i = 0; i < imagesArr.length; i++) {
        const title = formData.get(`title-${i}`) as string
        const description = formData.get(`description-${i}`) as string
        const file = imagesFileArr[i]
        const timestamp = new Date().getTime()
        const fileName = `images/${timestamp}`

        const responsePresignedUrl = await fetch(
          process.env.NEXT_PUBLIC_API_ENDPOINT +
            `/presigned-url?fileName=${fileName}&contentType=${file.type}`
        )
        const { preSignedUrl } = await responsePresignedUrl.json()

        if (preSignedUrl) {
          const response = await fetch(preSignedUrl, {
            method: 'put',
            body: file
          })
          if (!response.ok) {
            hadError = true
            break
          }
          const uploadMetadaResponse = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, fileName })
          })
          if (!uploadMetadaResponse.ok) {
            hadError = true
            break
          }
        }
      }
    } catch (err) {
      hadError = true
    }
    if (hadError) {
      return setShowError(true)
    }
    window.location.reload()
  }

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage - 1)
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={() => setIsAddDialogOpen(false)}
        aria-labelledby="add metadata"
        aria-describedby="dialog to add metadata to images"
      >
        <form
          onSubmit={(e) => {
            setAllowSubmit(false)
            handleSubmit(e)
          }}
          onChange={handleFormChange}
        >
          <DialogTitle>Add metadata</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ImagesPagination numberOfPages={numberOfPages} onPageChange={onPageChange} />
              {imagesArr.map((image, i) => {
                return (
                  <Box
                    key={i}
                    sx={{
                      padding: 2,
                      display: i === currentPage ? 'flex' : 'none',
                      flexDirection: 'column',
                      gap: 2,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Image src={image} width={200} height={200} alt={`preview of image ${i + 1}`} />
                    <Input
                      type="text"
                      name={`title-${i}`}
                      placeholder="title..."
                      sx={{ width: '100%' }}
                    />
                    <Input
                      type="text"
                      name={`description-${i}`}
                      placeholder="description...."
                      sx={{ width: '100%' }}
                    />
                  </Box>
                )
              })}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button disabled={!allowSubmit} type="submit" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </form>
        {showLoading && <Alert severity="info">Uploading images</Alert>}
        {showError && (
          <Alert severity="error">
            An error occurred while uploading some of the images, please try again
          </Alert>
        )}
      </Dialog>
    </>
  )
}
