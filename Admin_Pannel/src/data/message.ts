export interface Review{
    id : number
    Email: string
    review: string
    ProductId: number
    name: string
}

export const reviews = [
  {
    id: 1,
    name: "Alex Xavier",
    Email: "john.doe@example.com",
    review: "Great product! Really loved the quality and packaging.",
    ProductId: 101
  },
  {
    id: 2,
    name: "Sarah Khan",
    Email: "sarah.khan@example.com",
    review: "Not bad, delivery was a bit slow though.",
    ProductId: 102
  },
  {
    id: 3,
    name: "Ahmed Ali",
    Email: "ahmed.ali@example.com",
    review: "Loved the packaging and the quality of the shoes.",
    ProductId: 101
  }
];
