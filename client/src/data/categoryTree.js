export const categoryBrowseTree = [
  {
    title: 'براونيز فيتوار',
    subtitle: 'أصناف براونيز بطبقات متنوعة ولمسات شوكولاتة مناسبة لكل ذوق.',
    emoji: '🧇',
    sections: [
      { title: 'براونيز كيك', sourceCategory: 'براونيز' },
      { title: 'براونيز لوتس', sourceCategory: 'براونيز' },
      { title: 'براونيز نوتيلا', sourceCategory: 'براونيز' },
      { title: 'براونيز ميكس', sourceCategory: 'براونيز' }
    ]
  },
  {
    title: 'وافل وصوصات',
    subtitle: 'وافل طازة بصوصات وحشوات وتقديمات محبوبة.',
    emoji: '🍓',
    sections: [
      { title: 'وافل نوتيلا', sourceCategory: 'وافل' },
      { title: 'وافل لوتس', sourceCategory: 'وافل' },
      { title: 'وافل فواكه', sourceCategory: 'وافل' },
      { title: 'وافل ميكس', sourceCategory: 'وافل' }
    ]
  },
  {
    title: 'آيس كريم ومكسات',
    subtitle: 'تقديمات باردة ومكسات ممتعة للطلب السريع والمشاركة.',
    emoji: '🍨',
    sections: [
      { title: 'آيس كريم', sourceCategory: 'ايس كريم' },
      { title: 'مكسات باردة', sourceCategory: 'ايس كريم' },
      { title: 'كاسات مشاركة', sourceCategory: 'ايس كريم' },
      { title: 'عروض السويت', sourceCategory: 'ايس كريم' }
    ]
  },
  {
    title: 'صوصات وإضافات',
    subtitle: 'شوكولاتة وصوصات ومكسرات ولمسات نهائية تكمل الطلب.',
    emoji: '🍫',
    sections: [
      { title: 'صوصات شوكولاتة', sourceCategory: 'صوصات' },
      { title: 'صوصات بيضاء', sourceCategory: 'صوصات' },
      { title: 'مكسرات', sourceCategory: 'صوصات' },
      { title: 'إضافات نهائية', sourceCategory: 'صوصات' }
    ]
  }
];

export function resolveCategoryTarget(name) {
  for (const group of categoryBrowseTree) {
    if (group.title === name) {
      return {
        title: group.title,
        subtitle: group.subtitle,
        sourceCategory: group.sections[0]?.sourceCategory || name,
        sections: group.sections
      };
    }

    const section = group.sections.find((item) => item.title === name);
    if (section) {
      return {
        title: section.title,
        subtitle: `ضمن ${group.title}`,
        sourceCategory: section.sourceCategory,
        sections: group.sections,
        parentTitle: group.title
      };
    }
  }

  return null;
}
