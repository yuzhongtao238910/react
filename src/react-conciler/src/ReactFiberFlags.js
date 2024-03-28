export const NoFlags = 0b00000000000000000000000000
export const PerformedWork = 0b00000000000000000000000001

export const Placement = 0b00000000000000000000000010

export const Update = 0b00000000000000000000000100

export const ChildDeletion = 0b00000000000000000000001000


// dom节点的操作
export const MutationMask = Placement | Update
