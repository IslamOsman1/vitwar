import StoreSettings from '../models/StoreSettings.js';

const defaultHeroSlides = [
  {
    title: 'وافل فيتوار بصوصات غنية ولمسة شوكولاتة واضحة',
    tag: 'الأكثر طلبًا',
    note: 'أضف صورة المنتج أو طبق الحلا المميز من لوحة التحكم ليظهر كبانر رئيسي جذاب.',
    image: '',
    link: '/offers'
  },
  {
    title: 'براونيز ووافل بتوليفات محبوبة',
    tag: 'عرض خاص',
    note: 'غيّر النصوص والصور من لوحة التحكم لعرض الحلويات أو العروض اليومية بسهولة.',
    image: '',
    link: '/offers'
  },
  {
    title: 'حلا يخلّي اللمة أحلى ويعيشك مود السويتنس',
    tag: 'مميز',
    note: 'هذه الشريحة تعمل كبديل افتراضي حتى تضيف صور المنتجات الفعلية الخاصة بالمتجر.',
    image: '',
    link: '/offers'
  }
];

const defaultFeaturedCategories = [
  {
    title: 'براونيز كيك',
    category: 'براونيز',
    subtitle: 'قطع براونيز غنية مع شوكولاتة وحشوات متنوعة',
    image: ''
  },
  {
    title: 'وافل ونوتيلا',
    category: 'وافل',
    subtitle: 'وافل طازة بصوصات وطبقات محبوبة',
    image: ''
  },
  {
    title: 'آيس كريم ومكسات',
    category: 'ايس كريم',
    subtitle: 'لمسات باردة وتقديمات ممتعة تناسب المشاركة',
    image: ''
  },
  {
    title: 'صوصات وإضافات',
    category: 'صوصات',
    subtitle: 'صوصات وشوكولاتة وإضافات تكمل الطلب بطعم أقوى',
    image: ''
  }
];

const defaultCategoryGroups = [
  {
    title: 'براونيز فيتوار',
    subtitle: 'أصناف براونيز بطبقات متنوعة وأسعار مناسبة للطلب الفردي أو المشاركة.',
    sections: [
      { title: 'براونيز كيك', sourceCategory: 'براونيز' },
      { title: 'براونيز لوتس', sourceCategory: 'براونيز' },
      { title: 'براونيز نوتيلا', sourceCategory: 'براونيز' },
      { title: 'براونيز ميكس', sourceCategory: 'براونيز' }
    ]
  },
  {
    title: 'وافل وصوصات',
    subtitle: 'منيو وافل طازة يشمل صوصات وحشوات وتقديمات متنوعة.',
    sections: [
      { title: 'وافل نوتيلا', sourceCategory: 'وافل' },
      { title: 'وافل لوتس', sourceCategory: 'وافل' },
      { title: 'وافل فواكه', sourceCategory: 'وافل' },
      { title: 'وافل ميكس', sourceCategory: 'وافل' }
    ]
  },
  {
    title: 'آيس كريم ومكسات',
    subtitle: 'تقديمات باردة وعروض مشاركة تشمل آيس كريم ومكسرات وإضافات.',
    sections: [
      { title: 'آيس كريم', sourceCategory: 'ايس كريم' },
      { title: 'مكسات باردة', sourceCategory: 'ايس كريم' },
      { title: 'كاسات مشاركة', sourceCategory: 'ايس كريم' },
      { title: 'عروض السويت', sourceCategory: 'ايس كريم' }
    ]
  },
  {
    title: 'صوصات وإضافات',
    subtitle: 'شوكولاتة، صوصات، مكسرات، ولمسات نهائية تكمل تجربة الطلب.',
    sections: [
      { title: 'صوصات شوكولاتة', sourceCategory: 'صوصات' },
      { title: 'صوصات بيضاء', sourceCategory: 'صوصات' },
      { title: 'مكسرات', sourceCategory: 'صوصات' },
      { title: 'إضافات نهائية', sourceCategory: 'صوصات' }
    ]
  }
];

const defaultCheckoutGovernorates = [
  {
    name: 'القاهرة',
    shippingFee: 35,
    cities: ['مدينة نصر', 'مصر الجديدة', 'التجمع', 'المعادي']
  },
  {
    name: 'الجيزة',
    shippingFee: 40,
    cities: ['الدقي', 'المهندسين', '6 أكتوبر', 'الهرم']
  }
];

const defaultLoyaltySettings = {
  enabled: true,
  pointsPerPoint: 10,
  pointValue: 0.1,
  minRedeemPoints: 50,
  discountCodes: []
};

const defaultAdminControls = {
  deleteConfirmationEnabled: false,
  deletePasswordHash: ''
};

const defaultPolicies = {
  privacy: {
    title: 'سياسة الخصوصية',
    description: 'نوضح هنا كيفية جمع بياناتك واستخدامها وحمايتها أثناء استخدام موقع Vitwar.',
    sections: [
      { title: 'البيانات التي نجمعها', body: 'نجمع بيانات الحساب الأساسية مثل الاسم ورقم الهاتف والعنوان لتجهيز الطلبات والتواصل مع العميل بخصوص التوصيل أو أي تحديثات.' },
      { title: 'استخدام البيانات', body: 'تُستخدم البيانات لتأكيد الطلبات، تحسين تجربة المستخدم، وتقديم الدعم الفني وإدارة العروض أو نقاط الولاء إن كانت مفعلة.' },
      { title: 'حماية المعلومات', body: 'نلتزم بحماية بيانات العميل وعدم مشاركتها إلا في حدود تشغيل الخدمة مثل الدفع أو التوصيل أو الدعم الفني حسب الحاجة.' }
    ]
  },
  terms: {
    title: 'الشروط والأحكام',
    description: 'هذه الصفحة توضح القواعد المنظمة لاستخدام الموقع والطلبات والحسابات.',
    sections: [
      { title: 'استخدام الموقع', body: 'يجب استخدام الموقع بصورة قانونية وعدم إساءة استخدام الخدمات أو محاولة تعطيل الطلبات أو العبث ببيانات النظام.' },
      { title: 'الطلبات والدفع', body: 'يخضع قبول الطلب لتوافر الأصناف وصحة بيانات التوصيل ونجاح عملية الدفع حسب الوسيلة المختارة داخل الموقع.' },
      { title: 'إدارة الحساب', body: 'العميل مسؤول عن صحة بيانات حسابه والحفاظ على سرية بيانات الدخول ويحق للمطعم تحديث الشروط عند الحاجة.' }
    ]
  },
  shipping: {
    title: 'سياسة التوصيل',
    description: 'تفاصيل مناطق التوصيل، الرسوم، والمدة التقديرية لوصول الطلب.',
    sections: [
      { title: 'نطاق التوصيل', body: 'يظهر للعميل داخل نموذج الطلب فقط المحافظات والمدن المفعلة حاليًا من لوحة التحكم.' },
      { title: 'مدة التسليم', body: 'مدة التوصيل تقديرية وتختلف حسب المنطقة، ضغط التشغيل، وتوقيت الطلب، وقد يتم التواصل مع العميل لتأكيد الموعد.' },
      { title: 'رسوم التوصيل', body: 'تُحتسب رسوم التوصيل تلقائيًا حسب المحافظة أو الإعدادات الحالية ويظهر الإجمالي قبل تأكيد الطلب النهائي.' }
    ]
  },
  refund: {
    title: 'سياسة الاسترجاع والاستبدال',
    description: 'القواعد الأساسية الخاصة بإلغاء الطلبات أو مراجعة المشكلات المتعلقة بالأصناف.',
    sections: [
      { title: 'الاسترجاع أو الاستبدال', body: 'يمكن طلب المراجعة عند وجود مشكلة واضحة في الطلب أو وصول صنف غير مطابق، ويقوم فريق الدعم بتقييم الحالة.' },
      { title: 'إلغاء الطلب', body: 'الإلغاء متاح وفق حالة الطلب والمدة المسموح بها داخل النظام، وقد تختلف المعالجة للطلبات المدفوعة أونلاين.' },
      { title: 'آلية المعالجة', body: 'يقوم فريق الدعم بمراجعة كل حالة وتحديد الحل المناسب سواء استبدال، تعويض، أو أي معالجة أخرى مناسبة.' }
    ]
  }
};

const defaultAbout = {
  title: 'من نحن',
  description: 'Vitwar علامة حلويات متخصصة في الوافل والبراونيز والصوصات الغنية، وتقدّم تجربة طلب أونلاين سهلة وبهوية مرحة.',
  vision: 'أن نصبح وجهة مفضلة لعشاق الحلا والوافل بتجربة رقمية سهلة وطعم لا يُنسى.',
  mission: 'تقديم منيو حلويات واضح، تجهيز سريع، وجودة ثابتة في كل طلب سواء داخل الفرع أو عبر التوصيل.',
  values: 'البهجة، الجودة، النظافة، الوضوح، والاهتمام بكل تفصيلة في تجربة العميل.'
};

const isLegacyMarketSettings = (settings) => {
  const storeName = String(settings?.storeName || '').trim().toLowerCase();
  const featuredCategories = settings?.home?.featuredCategories || [];
  const categoryGroups = settings?.categoryGroups || [];

  const hasLegacyStoreName = ['al wekala market', 'al wekala', 'burger el khawaga', 'el khawaga'].includes(storeName);
  const hasLegacyCategories = featuredCategories.some((item) => ['خضار', 'فاكهة', 'ألبان', 'بقالة', 'برجر', 'فرايد تشيكن', 'كومبو', 'مقبلات'].includes(item?.category));
  const hasLegacyGroups = categoryGroups.some((group) => ['خضار وفاكهة', 'ألبان وفطار', 'بقالة البيت', 'برجر الخواجة', 'فرايد تشيكن', 'وجبات وكومبو', 'إضافات ومقبلات'].includes(group?.title));

  return hasLegacyStoreName || hasLegacyCategories || hasLegacyGroups;
};

export const ensureStoreSettings = async () => {
  let settings = await StoreSettings.findOne({ singleton: 'default' });
  if (!settings) {
    settings = await StoreSettings.create({
      singleton: 'default',
      storeName: 'Vitwar',
      storeTagline: 'حلويات ووافل وبراونيز بصوصات غنية وتجربة طلب لطيفة وسريعة.',
      supportEmail: 'support@vitwar.com',
      address: 'القاهرة، مصر',
      workingHours: 'يوميًا من 12 ظهرًا حتى 2 بعد منتصف الليل',
      about: defaultAbout,
      home: {
        heroSlides: defaultHeroSlides,
        featuredCategories: defaultFeaturedCategories
      },
      categoryGroups: defaultCategoryGroups,
      policies: defaultPolicies,
      checkout: {
        governorates: defaultCheckoutGovernorates
      },
      loyalty: defaultLoyaltySettings,
      adminControls: defaultAdminControls
    });
  } else {
    let changed = false;

    if (isLegacyMarketSettings(settings)) {
      settings.storeName = 'Vitwar';
      settings.storeTagline = 'حلويات ووافل وبراونيز بصوصات غنية وتجربة طلب لطيفة وسريعة.';
      if (!settings.supportEmail || ['support@alwekala.com', 'support@burgerelkhawaga.com'].includes(settings.supportEmail)) {
        settings.supportEmail = 'support@vitwar.com';
      }
      settings.address = settings.address || 'القاهرة، مصر';
      settings.workingHours = 'يوميًا من 12 ظهرًا حتى 2 بعد منتصف الليل';
      settings.about = defaultAbout;
      settings.home = settings.home || {};
      settings.home.heroSlides = defaultHeroSlides;
      settings.home.featuredCategories = defaultFeaturedCategories;
      settings.categoryGroups = defaultCategoryGroups;
      settings.policies = defaultPolicies;
      changed = true;
    }

    if (!settings.home?.heroSlides?.length) {
      settings.home.heroSlides = defaultHeroSlides;
      changed = true;
    }

    if (!settings.home?.featuredCategories?.length) {
      settings.home.featuredCategories = defaultFeaturedCategories;
      changed = true;
    }

    if (!settings.categoryGroups?.length) {
      settings.categoryGroups = defaultCategoryGroups;
      changed = true;
    }

    if (!settings.about?.title) {
      settings.about = defaultAbout;
      changed = true;
    }

    if (!settings.policies) {
      settings.policies = defaultPolicies;
      changed = true;
    } else {
      for (const key of Object.keys(defaultPolicies)) {
        const currentPolicy = settings.policies[key];
        if (!currentPolicy?.title || !Array.isArray(currentPolicy?.sections) || !currentPolicy.sections.length) {
          settings.policies[key] = {
            ...defaultPolicies[key],
            ...(currentPolicy?.toObject?.() || currentPolicy || {})
          };
          if (!Array.isArray(settings.policies[key].sections) || !settings.policies[key].sections.length) {
            settings.policies[key].sections = defaultPolicies[key].sections;
          }
          changed = true;
        }
      }
    }

    if (!settings.checkout?.governorates?.length) {
      settings.checkout = settings.checkout || {};
      settings.checkout.governorates = defaultCheckoutGovernorates;
      changed = true;
    }
    if (settings.checkout?.governorates?.some((item) => typeof item.shippingFee !== 'number')) {
      settings.checkout.governorates = settings.checkout.governorates.map((item) => ({
        name: item.name,
        shippingFee: Number(item.shippingFee ?? settings.checkout?.shippingFee ?? 35),
        cities: item.cities || []
      }));
      changed = true;
    }

    if (!settings.loyalty) {
      settings.loyalty = defaultLoyaltySettings;
      changed = true;
    } else {
      const normalizedCodes = Array.isArray(settings.loyalty.discountCodes)
        ? settings.loyalty.discountCodes
        : [];

      if (
        typeof settings.loyalty.enabled !== 'boolean' ||
        typeof settings.loyalty.pointsPerPoint !== 'number' ||
        typeof settings.loyalty.pointValue !== 'number' ||
        typeof settings.loyalty.minRedeemPoints !== 'number' ||
        settings.loyalty.discountCodes !== normalizedCodes
      ) {
        settings.loyalty = {
          ...defaultLoyaltySettings,
          ...settings.loyalty.toObject?.(),
          discountCodes: normalizedCodes
        };
        changed = true;
      }
    }

    if (!settings.adminControls) {
      settings.adminControls = defaultAdminControls;
      changed = true;
    } else if (typeof settings.adminControls.deleteConfirmationEnabled !== 'boolean' || typeof settings.adminControls.deletePasswordHash !== 'string') {
      settings.adminControls = {
        ...defaultAdminControls,
        ...settings.adminControls.toObject?.()
      };
      changed = true;
    }

    if (changed) await settings.save();
  }

  return settings;
};

export const serializePublicSettings = (settings) => ({
  storeName: settings.storeName,
  storeTagline: settings.storeTagline,
  supportEmail: settings.supportEmail,
  supportPhone: settings.supportPhone,
  address: settings.address,
  workingHours: settings.workingHours,
  whatsapp: settings.whatsapp,
  facebookUrl: settings.facebookUrl,
  instagramUrl: settings.instagramUrl,
  about: settings.about,
  policies: settings.policies,
  home: settings.home,
  categoryGroups: settings.categoryGroups,
  checkout: settings.checkout,
  payment: {
    cashOnDeliveryEnabled: settings.payment?.cashOnDeliveryEnabled,
    onlinePaymentEnabled: settings.payment?.onlinePaymentEnabled,
    onlineProvider: settings.payment?.onlineProvider,
    currency: settings.payment?.currency
  },
  loyalty: {
    enabled: settings.loyalty?.enabled !== false,
    pointsPerPoint: Number(settings.loyalty?.pointsPerPoint || defaultLoyaltySettings.pointsPerPoint),
    pointValue: Number(settings.loyalty?.pointValue || defaultLoyaltySettings.pointValue),
    minRedeemPoints: Number(settings.loyalty?.minRedeemPoints || defaultLoyaltySettings.minRedeemPoints)
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID || ''
});
