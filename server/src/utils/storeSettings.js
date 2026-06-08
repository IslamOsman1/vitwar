import StoreSettings from '../models/StoreSettings.js';

const defaultHeroSlides = [
  {
    title: 'سمـاش برجر بطعم الخواجة',
    tag: 'الأكثر طلبًا',
    note: 'أضف صورة الطبق أو البرجر المميز من لوحة التحكم ليظهر كبانر رئيسي جذاب.',
    image: '',
    link: '/offers'
  },
  {
    title: 'فرايد تشيكن مقرمش بخلطة خاصة',
    tag: 'عرض خاص',
    note: 'غيّر النصوص والصور من لوحة التحكم لعرض الوجبات أو العروض اليومية بسهولة.',
    image: '',
    link: '/offers'
  },
  {
    title: 'وجبات وكومبوهات جاهزة للجوع السريع',
    tag: 'مميز',
    note: 'هذه الشريحة تعمل كبديل افتراضي حتى تضيف صور الوجبات الفعلية الخاصة بالمطعم.',
    image: '',
    link: '/offers'
  }
];

const defaultFeaturedCategories = [
  {
    title: 'سمـاش برجر',
    category: 'برجر',
    subtitle: 'ساندوتشات لحم مشوية وصوصات خاصة',
    image: ''
  },
  {
    title: 'فرايد تشيكن',
    category: 'فرايد تشيكن',
    subtitle: 'قطع واستربس وسندوتشات كريسبي',
    image: ''
  },
  {
    title: 'كومبو ووجبات',
    category: 'كومبو',
    subtitle: 'وجبات كاملة مع البطاطس والمشروب',
    image: ''
  },
  {
    title: 'مقبلات وصوصات',
    category: 'مقبلات',
    subtitle: 'إضافات تكمل الطلب بطعم أقوى',
    image: ''
  }
];

const defaultCategoryGroups = [
  {
    title: 'برجر الخواجة',
    subtitle: 'ساندوتشات برجر مشوية بإضافات متعددة وأسعار مناسبة للطلب الفردي أو العائلي.',
    sections: [
      { title: 'سمـاش برجر', sourceCategory: 'برجر' },
      { title: 'دبل برجر', sourceCategory: 'برجر' },
      { title: 'تشيز برجر', sourceCategory: 'برجر' },
      { title: 'سيجنتشر برجر', sourceCategory: 'برجر' }
    ]
  },
  {
    title: 'فرايد تشيكن',
    subtitle: 'منيو دجاج مقلي مقرمش يشمل ساندوتشات وقطع وبوكسات مشاركة.',
    sections: [
      { title: 'كريسبي قطع', sourceCategory: 'فرايد تشيكن' },
      { title: 'استربس', sourceCategory: 'فرايد تشيكن' },
      { title: 'ساندوتش دجاج', sourceCategory: 'فرايد تشيكن' },
      { title: 'بوكسات مشاركة', sourceCategory: 'فرايد تشيكن' }
    ]
  },
  {
    title: 'وجبات وكومبو',
    subtitle: 'وجبات كاملة وعروض توفير تشمل البطاطس والمشروب والإضافات.',
    sections: [
      { title: 'وجبات فردية', sourceCategory: 'كومبو' },
      { title: 'وجبات دبل', sourceCategory: 'كومبو' },
      { title: 'وجبات عائلية', sourceCategory: 'كومبو' },
      { title: 'عروض التوفير', sourceCategory: 'كومبو' }
    ]
  },
  {
    title: 'إضافات ومقبلات',
    subtitle: 'بطاطس، صوصات، مشروبات، وحلويات خفيفة تكمل تجربة الطلب.',
    sections: [
      { title: 'بطاطس', sourceCategory: 'مقبلات' },
      { title: 'صوصات', sourceCategory: 'مقبلات' },
      { title: 'مشروبات', sourceCategory: 'مقبلات' },
      { title: 'حلويات خفيفة', sourceCategory: 'مقبلات' }
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
    description: 'نوضح هنا كيفية جمع بياناتك واستخدامها وحمايتها أثناء استخدام موقع Burger El Khawaga.',
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
  description: 'Burger El Khawaga مطعم متخصص في البرجر والدجاج المقلي، يقدّم وجبات سريعة بطعم ثابت وتجربة طلب أونلاين سهلة.',
  vision: 'أن نصبح وجهة مفضلة لعشاق البرجر والوجبات السريعة بتجربة رقمية سهلة وطعم لا يُنسى.',
  mission: 'تقديم منيو واضح، تجهيز سريع، وجودة ثابتة في كل طلب سواء داخل الفرع أو عبر التوصيل.',
  values: 'الطعم، السرعة، النظافة، الوضوح، والاهتمام بكل تفصيلة في تجربة العميل.'
};

const isLegacyMarketSettings = (settings) => {
  const storeName = String(settings?.storeName || '').trim().toLowerCase();
  const featuredCategories = settings?.home?.featuredCategories || [];
  const categoryGroups = settings?.categoryGroups || [];

  const hasLegacyStoreName = ['al wekala market', 'al wekala'].includes(storeName);
  const hasLegacyCategories = featuredCategories.some((item) => ['خضار', 'فاكهة', 'ألبان', 'بقالة'].includes(item?.category));
  const hasLegacyGroups = categoryGroups.some((group) => ['خضار وفاكهة', 'ألبان وفطار', 'بقالة البيت'].includes(group?.title));

  return hasLegacyStoreName || hasLegacyCategories || hasLegacyGroups;
};

export const ensureStoreSettings = async () => {
  let settings = await StoreSettings.findOne({ singleton: 'default' });
  if (!settings) {
    settings = await StoreSettings.create({
      singleton: 'default',
      storeName: 'Burger El Khawaga',
      storeTagline: 'مطعم متخصص في السماش برجر والفرايد تشيكن مع تجربة طلب سريعة وواضحة.',
      supportEmail: 'support@burgerelkhawaga.com',
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
      settings.storeName = 'Burger El Khawaga';
      settings.storeTagline = 'مطعم متخصص في السماش برجر والفرايد تشيكن مع تجربة طلب سريعة وواضحة.';
      if (!settings.supportEmail || settings.supportEmail === 'support@alwekala.com') {
        settings.supportEmail = 'support@burgerelkhawaga.com';
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
