// Mock API service

type Car = {
  id: number
  title: string
  price: number
  year: number
  mileage: number
  location: string
  images?: string[]
  has_360_view: boolean
  is_favorited: boolean
}

const mockCars: Car[] = [
  {
    id: 1,
    title: "Honda Civic",
    price: 12000,
    year: 2018,
    mileage: 45000,
    location: "Belgrade",
    images: ["https://via.placeholder.com/280x160"],
    has_360_view: true,
    is_favorited: false,
  },
  {
    id: 2,
    title: "Toyota Corolla",
    price: 10000,
    year: 2017,
    mileage: 60000,
    location: "Zagreb",
    images: ["https://via.placeholder.com/280x160"],
    has_360_view: false,
    is_favorited: false,
  },
]

export const apiService = {
  getCars: async () => {
    return { success: true, data: mockCars }
  },
  getFeaturedCars: async () => {
    return { success: true, data: mockCars.slice(0, 1) }
  },
  toggleFavorite: async (carId: number) => {
    return { success: true }
  },
}