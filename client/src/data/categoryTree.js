export const categoryBrowseTree = [
  {
    title: 'برجر الخواجة',
    subtitle: 'ساندوتشات سمـاش وبرجر لحم مع إضافات متنوعة وأحجام مناسبة لكل ذوق.',
    emoji: '🍔',
    sections: [
      { title: 'سمـاش برجر', sourceCategory: 'برجر' },
      { title: 'دبل برجر', sourceCategory: 'برجر' },
      { title: 'تشيز برجر', sourceCategory: 'برجر' },
      { title: 'سيجنتشر برجر', sourceCategory: 'برجر' }
    ]
  },
  {
    title: 'فرايد تشيكن',
    subtitle: 'قطع كريسبي، استربس، وساندوتشات دجاج مقلية بتتبيلات خاصة.',
    emoji: '🍗',
    sections: [
      { title: 'كريسبي قطع', sourceCategory: 'فرايد تشيكن' },
      { title: 'استربس', sourceCategory: 'فرايد تشيكن' },
      { title: 'ساندوتش دجاج', sourceCategory: 'فرايد تشيكن' },
      { title: 'بوكسات مشاركة', sourceCategory: 'فرايد تشيكن' }
    ]
  },
  {
    title: 'وجبات وكومبو',
    subtitle: 'حلول جاهزة للطلب السريع تشمل البطاطس والمشروب والإضافات.',
    emoji: '🥤',
    sections: [
      { title: 'وجبات فردية', sourceCategory: 'كومبو' },
      { title: 'وجبات دبل', sourceCategory: 'كومبو' },
      { title: 'وجبات عائلية', sourceCategory: 'كومبو' },
      { title: 'عروض التوفير', sourceCategory: 'كومبو' }
    ]
  },
  {
    title: 'إضافات ومقبلات',
    subtitle: 'بطاطس، صوصات، ومشروبات تكمّل الطلب وتزيده متعة.',
    emoji: '🍟',
    sections: [
      { title: 'بطاطس', sourceCategory: 'مقبلات' },
      { title: 'صوصات', sourceCategory: 'مقبلات' },
      { title: 'مشروبات', sourceCategory: 'مقبلات' },
      { title: 'حلويات خفيفة', sourceCategory: 'مقبلات' }
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
