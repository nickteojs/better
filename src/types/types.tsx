export type Todo = {
    id: number,
    description: string,
    completed: boolean,
    daily: boolean,
    day: number,
    month: number,
    dateNow: number,
    cycleStamp?: number
}

export type Shortcut = {
    id: number,
    name: string,
    url: string,
    image: string,
    isActive: boolean
  }
