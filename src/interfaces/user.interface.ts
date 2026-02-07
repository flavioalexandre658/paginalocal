export type UserRole = 'user' | 'admin'

export interface IUser {
  id: string
  name: string
  email: string
  phone: string | null
  emailVerified: boolean
  image: string | null
  role: UserRole
  banned: boolean
  banReason: string | null
  banExpires: number | null
  createdAt: Date
  updatedAt: Date
}

export interface ISession {
  id: string
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  userId: string
  impersonatedBy: string | null
}

export interface IAccount {
  id: string
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: Date | null
  refreshTokenExpiresAt: Date | null
  scope: string | null
  password: string | null
  createdAt: Date
  updatedAt: Date
}

export interface IVerification {
  id: string
  identifier: string
  value: string
  expiresAt: Date
  createdAt: Date | null
  updatedAt: Date | null
}
