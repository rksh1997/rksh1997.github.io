---
title: كيف تقوم بعمل مصادقة (Authentication) في مشروعك القادم؟
author: Rashad Kokash
pubDatetime: 2024-11-21T10:25:31Z
slug: wep-app-authentication
featured: false
tags:
  - Software engineering
  - Web development
description: ما هي الطريقة الصحيحة للمصادقة (Authentication) في تطبيقات الويب؟ ما مزايا وعيوب كل طريقة وكيف تختار ما يناسبك منها؟
---

## في هذه المقالة

## ما هي المصادقة (Authentication)؟

تُدعى أحياناً "استيثاق"، وهي التحقق من هوية شخص أو عملية.

في تطبيقات الويب، عندما تقوم بوضع إعجاب على منشور ما مثلاً، يقوم تطبيق الويب بمعرفة أنك أنت من وضع الإعجاب عن طريق المصادقة (Authentication).

قد تكون المصادقة (Authentication) بسيطة للغاية، كطلب اسم المستخدم وكلمة المرور عند تنفيذ كل عملية، لكن بالتأكيد هذا ليس عملياً. تخيل مثلاً أن كل ما أردت وضع إعجاب على منشور ما في منصات التواصل الاجتماعي يتطلب منك كتابة اسمك وكلمة المرور.

## كيف يتم عمل مصادقة (Authentication) في تطبيقات الويب؟

في الواقع، يوجد الكثير من الطرق للتحقق (أو التعرف) على هوية مستخدم التطبيق، وأشهرها هي الجلسات (Sessions) والتأشيرات (JSON Web Tokens).

## الجلسات (Sessions)

### ما هي الجلسة (Session)؟

في مثال المنصات الاجتماعية، يقوم المستخدم بإدخال اسم المستخدم وكلمة المرور مرة واحدة عند تسجيل الدخول.

وهذا ما نسميه ابتداء الجلسة. بعد ذلك، يقوم باستخدام المنصة بشكل مريح دون إدخال كلمة المرور عند كل عملية، وذلك بفضل الجلسة. ثم، عندما يقوم بتسجيل الخروج، يتم إنهاء الجلسة.

والجلسة عبارة عن معرف مؤقت (رقم عشوائي مثلاً) يتم إنشاؤه عندما يقوم مستخدم ما بتسجيل الدخول، ويتم تخزينه على المخدم (Server) وجعله يشير إلى المستخدم الذي قام بتسجيل الدخول، ثم يتم إرجاعه إلى المستخدم.

عندما يقوم المستخدم بعد ذلك بأي عملية (مثلاً وضع إعجاب)، يقوم تطبيق الويب بإرسال هذا المعرف إلى المخدم (Server)، فيقوم المخدم (Server) بالبحث عن صاحب هذا المعرف، وإذا وجده، يتم التعرف على صاحب عملية الإعجاب.

عند تسجيل الخروج (إنهاء الجلسة)، يقوم المستخدم ببعث طلب إلى المخدم (Server) لحذف هذا المعرف.

هاك مثالاً برمجياً:

```typescript
// (Server) برنامج المخدم

const sessions = new Map<number, number>(); // عبارة عن مجموعة من أرقام (أرقام الجلسات) التي تشير إلى أرقام (معرفات المستخدمين في قاعدة البيانات)

// تسجيل الدخول لأول مرة
function login(username: string, password: string) {
  if (isCorrect(username, password)) {
    const user = getUserFromDatabaseByUsername(username);
    const sessionId = uniqueNumber(); // يجب أن يكون معرف الجلسة عشوائي وغير قابل للتكرار لأنه لا يمكن لمستخدمين مختلفين أن يتشاركا في معرف جلسة واحد
    sessions.set(sessionId, user.id); // قمنا ببدأ الجلسة واحتفظنا برقمها الذي يشير إلى معرف المستخدم في قاعدة البيانات
    return sessionId; // نقوم بإرجاع معرف الجلسة للمستخدم حتى يقوم باستخدامه في العمليات اللاحقة
  } else {
    throw new Error("Invalid username or password");
  }
}

// وضع إعجاب
function likePost(sessionId: number, postId: number) {
  const userId = sessions.get(sessionId); // نقوم بالبحث عن معرف المستخدم عن طريق معرف الجلسة
  if (userId != null) {
    saveUserLikedPostInDatabase(postId, userId);
  } else {
    throw new Error("Unauthorized");
  }
}

// تسجيل الخروج
function logout(sessionId: number) {
  sessions.delete(sessionId);
}
```

```typescript
// Client برنامج المستخدم

// تسجيل الدخول
const sessionId = login("awesomeuser", "fuckstateofisrael");

// وضع إعجاب
likePost(sessionId, 1);

// تسجيل الخروج
logout(sessionId);
```

**طبعاً استخدمت التوابع (Functions) فوق لتبسيط الشرح لكن في الواقع هي عبارة عن طلبات Http.**

### أين يتم تخزين الجلسات (Sessions)؟

كما رأينا في المثال أعلاه، يجب تخزين الجلسات على المخدم (Server) وعند المستخدم (Client).

فأما على المخدم (Server)، فيتم الاحتفاظ بها في ذاكرة الوصول العشوائي (RAM) كمتغير، كما في المثال أعلاه. لكن لهذه الطريقة مشاكل سنستعرضها لاحقاً في المقالة.

وأما عند المستخدم (Client)، فيتم تخزينها عادةً في الكعكات (Cookies). والكعكات (Cookies) عبارة عن متغيرات يقوم المتصفح بإرسالها إلى المخدم (Server) من تلقاء نفسه عند كل طلب HTTP.

بالتالي، إذا تم حفظ معرف الجلسة في الكعكات، فسيتم إرساله إلى المخدم (Server) مع كل عملية لاحقة بدلاً من اسم المستخدم وكلمة المرور.

### مشاكل الجلسات (Sessions)

- سرقة الجلسات (Sessions):

  كما رأينا، الجلسة عبارة عن رقم أو سلسلة حروف عشوائية يسهل سرقتها من الهاكرز. فإذا استطاع أحدهم الوصول إليها، فسيستطيع إرسالها في طلباته وكأنما أنت من يقوم بإرسال هذه الطلبات.

- استهلاك الموارد:

  يتوجب على المخدم (Server) تخزين الجلسات في مكان ما، سواء على ذاكرة الوصول العشوائي أو على قاعدة بيانات منفصلة أو على القرص الصلب. في أي حالة من هذه الحالات، أنت تستخدم موارد المخدم (Server).

- كثرة الطلبات على قاعدة البيانات:

  لنفترض أن تطبيقك يحتاج التفريق بين أنواع المستخدمين، فهذا مدير وذاك مستخدم عادي، ولكل واحد صلاحيات مختلفة.
  بالتالي، مجرد معرفة معرف المستخدم لن يكون كافياً، بل ستحتاج أن تقوم بجلبه من قاعدة البيانات عند كل طلب للتأكد من الصلاحية.

- مشاكل المشاركة بين نسخ المخدم (Server):

  عندما ينتشر تطبيقك ويستخدمه آلاف الناس، فلن يستطيع مخدم (Server) واحد من برنامجك خدمة كل هذه الطلبات. وبالتالي، ستحتاج لعدة مخدمات تقوم بتشغيل برنامجك، ثم تقوم بتوزيع طلبات المستخدمين عليها (Load balancing).

  لكن المشكلة هي أنه إذا كنت تقوم بحفظ الجلسات في ذاكرة الوصول العشوائي (RAM)، فهذه الذاكرة غير مشتركة بين كل المخدمات. وبالتالي، سيكون المستخدم قد قام بتسجيل الدخول على مخدم واحد دون غيره.

  في هذه الحالة، ستحتاج إلى إرسال جميع طلبات المستخدم اللاحقة إلى نفس المخدم الذي قام بتسجيل الدخول عليه (Sticky session)، أو أن تقوم بحفظ الجلسات في مكان مشترك بين جميع المخدمات، كقاعدة بيانات مخصصة مثل Redis.

## التأشيرات (Json web tokens)

### ما هي التأشيرات (Jwt)؟

عندما تريد السفر إلى بلد ما، وإن كنت تعيس الحظ بجنسيتك، فأكيد أنك ستحتاج إلى تأشيرة. ما ستقوم به هو إعطاء جواز سفرك إلى قنصلية البلد التي تريد الذهاب إليها، والقنصلية ستقوم بالختم على جوازك أو التوقيع عليه مع إعطائك مدة صلاحية لهذه التأشيرة.

بنفس الطريقة تماماً، تعمل تأشيرات الويب (JSON Web Tokens). فبدلاً من جواز السفر، أنت تقوم بتقديم اسم المستخدم وكلمة المرور، ثم يقوم المخدم (Server) بالتحقق منهما، وإذا كانت صحيحة، سيقوم بالتوقيع لك.

عند إرسال طلب آخر للمخدم (Server)، ستقوم بإرفاق هذا التوقيع مع الطلب تماماً كما ستفعل عند تخطي الحدود (إظهار التأشيرة).

عندها، سيقوم المخدم (Server) بالتأكد من أن التوقيع غير مزور وأن صلاحيته لازالت سارية، ثم سيسمح لك بإكمال العملية.

هاك مثالاً برمجياً:

```typescript
// (Server) برنامج المخدم

const signature = "secret-complex-signature"; // اعتبر هذا توقيع القنصلية

// تسجيل الدخول لأول مرة
function login(username: string, password: string) {
  if (isCorrect(username, password)) {
    const user = getUserFromDatabaseByUsername(username);
    const jsonWebToken: string = sign(user.id); // نقوم بالتوقيع على معرف المستخدم في قاعدة البيانات
    return jsonWebToken;
  } else {
    throw new Error("Invalid username or password");
  }
}

// وضع إعجاب
function likePost(jwt: string, postId: number) {
  if (isValidSignature(jwt) && isNotExpired(jwt)) {
    // نقوم بالتحقق من التوقيع وصلاحية التأشيرة
    const userId = getUserIdFromJwt(jwt); // هنا نستخرج معرف االمستخدم من التأشيرة
    saveUserLikedPostInDatabase(postId, userId);
  } else {
    throw new Error("Unauthorized");
  }
}
```

```typescript
// Client برنامج المستخدم

// تسجيل الدخول
const jwt = login("awesomeuser", "fuckstateofisrael");

// وضع إعجاب
likePost(jwt, 1);
```

لاحظ معي ملاحظتين:

1. لم يقم المخدم بتخزين أي شيء، وبالتالي تخلصنا من مشكلة استهلاك الموارد.
2. لا توجد طريقة لتسجيل الخروج، فتسجيل الخروج يكون بانتهاء صلاحية التأشيرة أو توقف المستخدم من تلقاء نفسه عن استخدام التأشيرة.

### أين يتم تخزين التأشيرات (Json web tokens)؟

التأشيرات يتم تخزينها عند المستخدم (Client) فقط، وعادةً في Local Storage الخاصة بالمتصفح.

ثم يتم إرسالها كـ HTTP header إلى المخدم (Server) مع كل طلب لاحق.

### مشاكل التأشيرات (Json web tokens):

- سرقة التأشيرات:

  إن Local Storage ليست أكثر حماية من الكعكات (Cookies)، فإذا كانت الكعكات تسرق عن طريق CSRF، فالتأشيرات تسرق عن طريق XSS.

  والمشكلة الكبرى هنا هي عدم القدرة على تسجيل الخروج (إبطال التأشيرة)، وبالتالي إذا سرقت، فخلاص، والله أمورك تصبح آيس كوفي عالآخر.

- إبطاء طلبات HTTP:

  كلما قمت بتخزين بيانات أكثر ضمن التأشيرة، كلما كان حجمها أكبر. وبما أنها تُرسل مع كل طلب (HTTP request)، فهي تستهلك من موارد شبكة الإنترنت وتقوم بإبطاء الطلب.

## ما الحل؟

ماذا لو قمنا بإعطاء المستخدم بدل التوقيع توقيعين؟، أحدهما صلاحيته دقيقة واحدة، والآخر صلاحيته شهر كامل مثلاً.

يستطيع المستخدم استخدام التوقيع الأول قصير الصلاحية لإجراء عمليات على المخدم (Server)، كوضع إعجاب على منشور. لكنه لا يستطيع استخدام التوقيع الثاني لهذه العمليات.

أما التوقيع الثاني طويل المدى، فيستطيع من خلاله الحصول على توقيع قصير المدى جديد.

ثم نقوم بتخزين التوقيع طويل المدى كما قمنا بتخزين الجلسة (Session) على المخدم (Server) وعند المستخدم (Client). وعند تسجيل الخروج، نقوم بحذف التوقيع طويل المدى من المخدم (Server). وبالتالي، ستنتهي صلاحية تسجيل الدخول بعد دقيقة واحدة على الأكثر، وهي مدة صلاحية التوقيع قصير المدى الذي يملكه المستخدم حالياً.

يسمى التوقيع قصير المدى (Access Token) أو تأشيرة الوصول (والتي تسمح لك بإجراء العمليات على المخدم).

بينما يسمى التوقيع طويل المدى (Refresh Token) أي تأشيرة التجديد، والتي تسمح لك بتجديد تأشيرة الوصول.

### ما هي المشاكل التي حللناها بهذا الحل

- السرقة:

  إن استطاع الهاكر سرقة تأشيرة الوصول (Access Token)، فإنه سيستفيد منها على الأكثر دقيقة واحدة.

  وإن استطاع سرقة تأشيرة التجديد (Refresh Token)، فيمكن للمستخدم الضغط على تسجيل الخروج لإنهاء صلاحية هذه التأشيرة.

- استهلاك الموارد:

  في الواقع، نحتاج لتخزين تأشيرة التجديد (Refresh Token) في مكان ما.

- كثرة الطلبات على قاعدة البيانات:

  يمكنك تخزين ما تشاء في تأشيرة الصلاحية (Access Token)، ومنها نوع المستخدم (مدير - مشرف...)، وبالتالي لن تحتاج إلى الطلب من قاعدة البيانات عند كل عملية بل تم تقليل هذه الطلبات إلى مرة واحدة عند تجديد تأشيرة الوصول (Access Token).

- المشاركة بين نسخ المخدم (Server):

  تم حل هذه المشكلة إذ أن تأشيرة الوصول (Access Token) يمكن التحقق منها من أي مخدم (Server).

  أما عن تأشيرة التجديد (Refresh Token)، فعادةً ما يتم تخزينها في قاعدة البيانات، وبالتالي مشاركتها مع جميع نسخ المخدم (Server) الخاص ببرنامجك.

## المخلص

لكل طريقة محاسن ومساوئ، ولكل تطبيق متطلبات غير وظيفية مختلفة. بالتالي، ليست إحدى الطرق أفضل من الأخرى، بل المتطلبات هي التي تحدد الطريقة الأفضل.

وصدق أو لا تصدق، أن هناك حالات يكون طلب اسم المستخدم وكلمة المرور عند كل عملية هو الخيار الأفضل. وهذه الطريقة تسمى Basic Auth.
