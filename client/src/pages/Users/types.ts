export type TUsers = {
    _id: string
    role: number
    status: "active" | "inactive"  | "deleted"
    email: string
  }