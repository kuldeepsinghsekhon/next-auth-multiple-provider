'use client'

import { RoleDialog  } from "./edit-role-dialog"

export function CreateRoleButton({ permissions }) {
  return <RoleDialog permissions={permissions} />
}