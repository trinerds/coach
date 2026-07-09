export class Pool {
  query = () => Promise.resolve({ rows: [] })
  connect = () => Promise.resolve({ release: () => undefined })
  end = () => Promise.resolve(undefined)
  on = () => this
}

export class Client {
  query = () => Promise.resolve({ rows: [] })
  connect = () => Promise.resolve(undefined)
  end = () => Promise.resolve(undefined)
  on = () => this
}

const pg = { Pool, Client }

export default pg
