export interface Resto {
  _id: string,
  nom: string,
  coord: Coord,
  adresse: Adresse,
  cuisine: string[]
}

interface Adresse {
  rue: string,
  ville: string,
  cp: number,
  pays: string
}

interface Coord {
  lat: number, // latitude
  lng: number // longitude
}
