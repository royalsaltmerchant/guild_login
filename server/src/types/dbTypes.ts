type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  admin: boolean,
  email: string,
  password: string,
  approved_asset_count: number,
  coins: number,
  active: boolean,
  premium: boolean,
  upload_count: number,
  about: string,
  contributor: boolean,
  address: string,
  phone: string,
  contributions: Array<Contribution>
}

type Contribution = {
  id: number,
  date_created: string,
  entry_id: number,
  project_id: number,
  user_id: number,
  status: string,
  amount: number,
  contributed_assets: Array<ContributedAsset>
}

type ContributedAsset = {
  id: number,
  name: string,
  contribution_id: number,
  status: string,
  uuid: string
}

export {
  User,
  Contribution,
  ContributedAsset
}