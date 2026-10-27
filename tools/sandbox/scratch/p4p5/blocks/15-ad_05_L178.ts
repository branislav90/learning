// api-types.ts — shape owned by the backend team
export interface UserDto {
  id: number;
  first_name: string;
  last_name: string | null;
  created_at: string;           // ISO 8601
  plan_cd: 'F' | 'P' | 'E';
}

// domain.ts — shape owned by this front end
export interface User {
  id: string;
  fullName: string;
  createdAt: Date;
  plan: 'free' | 'pro' | 'enterprise';
}

// adapters/user.ts
const planByCode = {
  F: 'free',
  P: 'pro',
  E: 'enterprise',
} as const satisfies Record<UserDto['plan_cd'], User['plan']>;

export function toUser(dto: UserDto): User {
  return {
    id: String(dto.id),
    fullName: [dto.first_name, dto.last_name].filter(Boolean).join(' '),
    createdAt: new Date(dto.created_at),
    plan: planByCode[dto.plan_cd],
  };
}
export {};
