export class AuthMapper {
  static toDomain(entity: any) {
    if (!entity) return entity;
    const { passwordHash, verificationToken, ...safeUser } = entity;
    return {
      ...safeUser,
      createdAt: new Date(entity.createdAt).getTime(),
      updatedAt: new Date(entity.updatedAt).getTime(),
    };
  }
}
