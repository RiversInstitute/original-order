export type Schema = {
  works: Work[]
}

export type Work = {
  id: string
  title: string
  description: string
  image: string
}