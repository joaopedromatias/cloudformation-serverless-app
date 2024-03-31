declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_ENDPOINT: string
    }
  }
}

export interface Images {
  image_group: number
  title: string
  description: string
  uri: string
  created_at: string
}
