export const categoryBrowseTree = [
  {
    title: 'أجبان ولحوم',
    subtitle: 'اختيارات مبردة ومجمدة للاستخدام اليومي والعائلي.',
    emoji: '🧀',
    sections: [
      { title: 'جبن قريش', sourceCategory: 'ألبان' },
      { title: 'أجبان بيضاء', sourceCategory: 'ألبان' },
      { title: 'لحوم مجمدة', sourceCategory: 'بقالة' },
      { title: 'لحوم طازجة', sourceCategory: 'بقالة' },
    ],
  },
  {
    title: 'خضار وفاكهة',
    subtitle: 'منتجات طازجة مرتبة حسب نوع الاستخدام اليومي.',
    emoji: '🥬',
    sections: [
      { title: 'خضار ورقية', sourceCategory: 'خضار' },
      { title: 'خضار طبخ', sourceCategory: 'خضار' },
      { title: 'فاكهة موسمية', sourceCategory: 'فاكهة' },
      { title: 'فاكهة يومية', sourceCategory: 'فاكهة' },
    ],
  },
  {
    title: 'ألبان وفطار',
    subtitle: 'كل ما تحتاجه لوجبات الصباح ومنتجات التبريد اليومية.',
    emoji: '🥛',
    sections: [
      { title: 'لبن وحليب', sourceCategory: 'ألبان' },
      { title: 'زبادي وألبان', sourceCategory: 'ألبان' },
      { title: 'مربى وعسل', sourceCategory: 'بقالة' },
      { title: 'مخبوزات خفيفة', sourceCategory: 'بقالة' },
    ],
  },
  {
    title: 'بقالة البيت',
    subtitle: 'احتياجات المطبخ والبيت في أقسام واضحة وسهلة الوصول.',
    emoji: '🛒',
    sections: [
      { title: 'أرز ومكرونة', sourceCategory: 'بقالة' },
      { title: 'زيوت وسمن', sourceCategory: 'بقالة' },
      { title: 'تجميد وحفظ', sourceCategory: 'بقالة' },
      { title: 'منظفات أساسية', sourceCategory: 'بقالة' },
    ],
  },
];

export function resolveCategoryTarget(name) {
  for (const group of categoryBrowseTree) {
    if (group.title === name) {
      return {
        title: group.title,
        subtitle: group.subtitle,
        sourceCategory: group.sections[0]?.sourceCategory || name,
        sections: group.sections,
      };
    }

    const section = group.sections.find(item => item.title === name);
    if (section) {
      return {
        title: section.title,
        subtitle: `ضمن ${group.title}`,
        sourceCategory: section.sourceCategory,
        sections: group.sections,
        parentTitle: group.title,
      };
    }
  }

  return null;
}
