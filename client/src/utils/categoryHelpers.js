import { categoryBrowseTree as fallbackCategoryTree } from '../data/categoryTree.js';

export const getCategoryGroups = (settings) => {
  return settings?.categoryGroups?.length ? settings.categoryGroups : fallbackCategoryTree;
};

export const getSourceCategories = (groups) => {
  return [...new Set(
    groups.flatMap((group) => (group.sections || []).map((section) => section.sourceCategory)).filter(Boolean)
  )];
};

export const resolveCategoryTargetFromGroups = (groups, name) => {
  for (const group of groups) {
    if (group.title === name) {
      return {
        title: group.title,
        subtitle: group.subtitle,
        sourceCategory: group.sections?.[0]?.sourceCategory || name,
        sections: group.sections || []
      };
    }

    const section = (group.sections || []).find((item) => item.title === name);
    if (section) {
      return {
        title: section.title,
        subtitle: `ضمن ${group.title}`,
        sourceCategory: section.sourceCategory,
        sections: group.sections || [],
        parentTitle: group.title
      };
    }
  }

  return null;
};
