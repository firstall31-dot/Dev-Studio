export class CVMapper {
  static toDomain(entity: any) {
    if (!entity) return entity;
    try {
      return {
        ...entity,
        personalInfo:
          typeof entity.personalInfo === "string"
            ? JSON.parse(entity.personalInfo)
            : entity.personalInfo || {},
        experience:
          typeof entity.experience === "string"
            ? JSON.parse(entity.experience)
            : entity.experience || [],
        skills:
          typeof entity.skills === "string"
            ? JSON.parse(entity.skills)
            : entity.skills || {},
        education:
          typeof entity.education === "string"
            ? JSON.parse(entity.education)
            : entity.education || [],
        projects:
          typeof entity.projects === "string"
            ? JSON.parse(entity.projects)
            : entity.projects || [],
        languages:
          typeof entity.languages === "string"
            ? JSON.parse(entity.languages)
            : entity.languages || [],
      };
    } catch {
      return entity;
    }
  }
}
