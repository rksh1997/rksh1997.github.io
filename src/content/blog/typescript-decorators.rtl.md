---
title: ما هي الـ Decorators؟ وكيف تستخدمها في Typescript؟
author: Rashad Kokash
pubDatetime: 2024-10-05T04:06:31Z
slug: typescript-decorators
featured: false
tags:
  - Software engineering
  - Design Patterns
  - Typescript
  - Javascript
description: في هذا المقال، سنتناول مفهوم Decorator design pattern، ونستعرض كيف يمكن استخدام الـ Decorators في TypeScript لكتابة كود أكثر تنظيمًا وقابلية للتوسع.
---

## في هذه المقالة

## مقدمة

أكيد أنك سمعت عن الـ Decorators مرة في حياتك أو ظهرت لك مشكلة في Typescript بخصوص تفعيلها أو استعملتها لكنك لم تدر أنك تستعمل Decorators.

شاهد هذا المثال:

```ts
const myCoffee = new Coffee();
const myCoffeeWithMilk = new WithMilk(myCoffee);
const myCoffeeWithMilkAndSugar = new WithSugar(myCoffeeWithMilk);
```

وشاهد هذا أيضا:

```ts
@Controller("users")
export class UsersController {
  @Get("/")
  getAllUsers() {
    return [];
  }
}
```

أيهما يستخدم الـ Decorators؟

في الواقع، كلاهما، لكنهما أمران مختلفان. فالأول يستخدم نمطاً تصميمياً (Design Pattern) في هندسة البرمجيات يُدعى Decorator، أما الثاني فيستخدم ميزة في TypeScript تُدعى Decorator.

## الـ Decorator في هندسة البرمجيات (Decorator Design Pattern)

نمط الـ Decorator هو نمط تصميمي (Design Pattern) يستخدم لتعديل سلوك كائن (Object) دون الحاجة إلى تعديل واجهته التخاطبية (Interface). يُعرف هذا النمط أحيانًا باسم Wrapper Design Pattern.

لنفهم الفكرة بشكل أفضل، دعنا نأخذ مثالًا على صنع البيتزا. البيتزا الأساسية تتكون من العجين، الصوص، والجبن. لنتخيل أن تكلفة هذه البيتزا الأساسية هي 50 قطعة نقدية.

يمكنك إضافة مكونات مختلفة إلى البيتزا، مثل الزيتون أو الفطر، وكلما أضفت مكونًا جديدًا، يزداد السعر بناءً على تكلفة هذا المكون. على سبيل المثال، إذا أضفت الزيتون، فسيرتفع السعر بمقدار 3 قطع نقدية، وإذا أضفت الفطر، فسيزيد السعر بمقدار 10 قطع. وإذا أضفت الاثنين زاد السعر ١٣ قطعة.

من الواضح أنه يمكنك الحصول على عدد كبير جدًا من التركيبات المختلفة للمكونات (التباديل الرياضية). مثلًا، يمكن أن تكون البيتزا مع زيتون ولحم، أو زيتون وأناناس، وغيرها من التركيبات.

لو أردنا تمثيل هذه التركيبات برمجيًا عن طريق إنشاء Classes مختلفة لكل تركيبة. فسنحتاج إلى عدد ضخم جدًا من الـ Classes، وهو حل غير عملي.

هنا يأتي دور نمط الـ Decorator كحل أمثل. في هذا النمط، نعرّف Class واحدة للبيتزا الأساسية، ثم نعرّف Class لكل مكون إضافي على حدا. وعند إضافة مكون جديد إلى البيتزا، نقوم \"بتغليف\" كائن البيتزا الأساسي بالـ Decorator الخاص بهذا المكون.

وكما اتفقنا سابقاً أن هذ النمط التصميمي (Design Pattern) لا يقوم بتغيير الواجهة التخاطبية (Interface) فعند تغليف كائن البيتزا الأساسية بـ Decorator أحد المكونات فإن الكائن الجديد لا بد أن يكون من نوع بيتزا وليس كائن من نوع جديد.

لنكتب بعض الأكواد حتى تتضح الفكرة:

```ts
abstract class Pizza {
  abstract getPrice(): number;
}

class BasicPizza extends Pizza {
  constructor() {
    super();
  }
  public getPrice() {
    return 50;
  }
}
```

هنا قمنا بتعريف البيتزا الأساسية وهي من نوع Pizza.
لنقم الآن بتعريف Decorator الزيتون والفطر:

```ts
// لاحظ كيف أن
// Decorator الـ
// Pizza هو كذلك من نوع
// أي أنه مجبر أن يحتوي على نفس الواجهة التخاطبية للبيتزا.
abstract class PizzaDecorator extends Pizza {
  // هنا نقوم بحفظ البيتزا التي سنقوم بتغليفها باستخدام هذا
  // Decorator الـ
  // حتى نقوم بتعديل سلوكها
  protected pizza: Pizza;
  constructor(pizza: Pizza) {
    super();
    this.pizza = pizza;
  }
}

class OlivePizzaDecorator extends PizzaDecorator {
  constructor(pizza: Pizza) {
    super(pizza);
  }
  // الزيتون يقوم بتعديل سلوك البيتزا المغلفة باضافة ٣ قطع نقدية للسعر Decorator
  getPrice() {
    return 3 + this.pizza.getPrice();
  }
}

class MushroomPizzaDecorator extends PizzaDecorator {
  constructor(pizza: Pizza) {
    super(pizza);
  }
  // الفطر يقوم بتعديل سلوك البيتزا المغلفة باضافة ١٠ قطع نقدية للسعر Decorator
  getPrice() {
    return 10 + this.pizza.getPrice();
  }
}
```

ثم يمكنك تركيب أي خلطة تحبها للبيتزا بهذه الطريقة:

```ts
const basicPizza = new BasicPizza();
console.log(basicPizza.getPrice()); // 50

const pizzaWithOlive = new OlivePizzaDecorator(basicPizza);
console.log(pizzaWithOlive.getPrice()); // 53

const pizzaWithMushroom = new MushroomPizzaDecorator(basicPizza);
console.log(pizzaWithMushroom.getPrice()); // 60

const pizzaWithOliveAndMushroom = new OlivePizzaDecorator(
  new MushroomPizzaDecorator(basicPizza)
);
console.log(pizzaWithOliveAndMushroom.getPrice()); //63
```

لاحظ في `pizzaWithOliveAndMushroom` كيف يمكن استخدام الـ Decorator لتغليف Decorator آخر لأن كليهما أيضاً من نوع Pizza.

## الـ Decorator في Javascript/Typescript

هو ليس نمطاً تصميمياً (Design Pattern). بل إنه ميزة من اللغة بذاتها تتيح لك اختصار الأكواد المتكررة (Syntactic Sugar). يعني هو يخدم غرضاً شبيهاً جداً بغرض التوابع (Functions). وسمي Decorator لأنه أيضاً يقوم بتغليف شيء ما ويقوم بالتعديل على طريقة عمله دون تغيير واجهته التخاطبية (Interface).

وفي أغلب الأوقات يمكنك الوصول لنتيجة الـ Decorator نفسها باستخدام التوابع فقط.

**مثال:** لنفترض أنني أريد طباعة جملة ما قبل تنفيذ إحدى التوابع في class معين.

- باستخدام الـ Decorator:

  لنفترض أن هناك Decorator يدعى `log`. لاستخدامه سنقوم بكتابة هذا الكود:

  ```ts
  class MyClass {
    @log // <------- شاهد هنا
    doSomething() {
      // does something
    }
  }
  ```

- لاستبداله بتابع (Function):

  ```ts
  function log(fn: Function) {
    return function (...args: any[]) {
      console.log("Executing fn");
      return originalMethod.apply(this, args);
    };
  }

  class MyClass {
    doSomething() {
      // does something
    }
  }

  const myObj = new MyClass();
  myObj.doSomething = log(myObj.doSomething); // <----- شاهد هنا
  ```

## أين يمكنك استخدام الـ Decorators في Typescript؟

1. على صف (class).

   ```ts
   @decorator
   class MyClass {}
   ```

2. على تابع (method) ضمن class.

   ```ts
   class MyClass {
     @decorator
     doSomething() {
       // ...
     }
   }
   ```

3. على خاصية (property) ضمن class.

   ```ts
   class MyClass {
     @decorator
     private prop1: string;
   }
   ```

4. على عامل (parameter) لتابع (method) ضمن class.

   ```ts
   class MyClass {
     doSomething(@decorator param1: string) {
       // ...
     }
   }
   ```

## الـ Decorators على الصفوف (Classes)

لنقم بعمل Decorator يقوم بإضافة حقل `createdAt` من نوع `Date` للصف (class) وتكون قيمة هذا التاريخ هو وقت إنشاء نسخة (instance) من هذا الصف (class).

```ts
function AddCreatedAtDecorator(theClass: any): any {
  return class extends theClass {
    public readonly createdAt: Date = new Date();
  };
}

@AddCreatedAtDecorator
class UserEntity {
  constructor(public readonly name: string) {}
}

const me: any = new UserEntity("Rashad");

console.log(me.name);
console.log(me.createdAt); // سيطبع تاريخ إنشاء هذه النسخة
```

لكن لاحظ أنني اضطررت إلى تنميط متغير `me` بنوع `any` وذلك لأن الصف (class) الأساسي لا يحتوي على `createdAt` فيه، و الـ Decorator لا يقوم بتغيير النوع (type) الأساسي للصف ولذلك لو لم أضف `any` لزعلت Typescript.

لنقيم الآن بعمل مثال آخر لـ Decorator يقوم بطباعة رسالة عند إنشاء نسخة (instance) من صف (class). ويتم تحديد الرسالة من قبل المبرمج أثناء استخدام الـ Decorator.

```ts
// هذا النوع يعني صف
type ClassType = { new (...args: any[]): {} };

function LogOnCreation(message: string) {
  return (constructor: { new (...args: any[]): {} }) => {
    return class extends constructor {
      constructor() {
        super();
        console.log(message);
      }
    };
  };
}

@LogOnCreation("Created rabbit")
class Rabbit {}

@LogOnCreation("Created turtle")
class Turtle {}

// Created rabbit هذا السطر عند تنفيذه سيقوم بطباعة
const rabbit = new Rabbit();

// Created turtle هذا السطر عند تنفيذه سيقوم بطباعة
const turtle = new Turtle();
```

### تدريب

قم بكتابة Decorator لصف (Class) يقوم بتحويله لـ Singleton بحيث يمكنك إنشاء نسخة واحدة فقط من الصف (Class).

## الـ Decorators على الوظائف (Methods) ضمن الصفوف (Classes)

لكتابة Decorator خاص بالـ Methods نقوم بكتابة تابع (Function) يستقبل ٣ عوامل (Parameters) وهي:

- Target: وتكون قيمتها هي الـ Prototype الخاص بالـ class الذي توجد فيه الـ Method أو إلى الـ class نفسه في حال كانت static method.
- Property key: اسم الوظيفة (Method)
- Descriptor: وهو معرف الوظيفة (Method) وهو عبارة عن object يحتوي على value (وهي قيمة ما نقوم بتغليفه؛ في هذه الحالة هو مؤشر على الـ Method)، و بعض الإعدادات الأخرى التي تستخدمها Javascript (اقرأ المراجع لمزيد من المعلومات).

لنقم بكتابة Decorator يقوم بحساب الوقت اللازم لتنفيذ وظيفة (Method) ويقوم بطباعة هذا الوقت:

```ts
function printExecutionTime(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.time(propertyKey);
    method.apply(this, args);
    console.timeEnd(propertyKey);
  };
}

class Sun {
  @printExecutionTime
  rotate() {
    console.log("Sun is rotating");
  }
}

const sun = new Sun();
sun.rotate();
```

والخرج سيكون:

```
Sun is rotating
rotate: 0.763ms
```

### تدريب

لدينا وظيفة (Method) تقوم بإرجاع رقم عشوائي بين -١٠٠ و ١٠٠.

قم ببرمجة Decorator لهذه الوظيفة (Method) يقوم بتحويل القيمة الراجعة إلى القيمة المطلقة (يحولها لموجبة إن كانت سالبة).

سيكون استخدام هذا الـ Decorator على الشكل:

```ts
class Point {
  @abs
  distanceToCenter() {
    return -100 + Math.random() * 200;
  }
}
```

قم ببرمجة `abs@`

## الـ Decorators على الخصائص (Properties) ضمن الصفوف (Classes)

لكتابة Decorator خاص بالـ Properties نقوم بكتابة تابع (Function) يستقبل عاملين (Parameters) وهما:

- Target: وتكون قيمتها هي الـ Prototype الخاص بالـ class الذي توجد فيه الـ Property أو إلى الـ class نفسه في حال كانت static property.
- Property key: اسم الخاضية

لنقم بكتابة Decorator يقوم بطباعة اسم الخاصية (Property):

```ts
function printPropertyName(target: any, propertyKey: string) {
  console.log(propertyKey);
}

class Point {
  @printPropertyName
  private property1: string;
}
```

سيقوم هذا الكود بطباعة `property1` عند تشغيله.

طبعاً أكيد أن هذا الـ Decorator غير مفيد، لكن لبرمجة Decorator للخصائص (Properties) يكون ذو فائدة نحتاج أن نتعلم Reflect metadata وهو شيء لن أقوم بشرحه في هذه المقالة لكن في مقالة قادمة إن شاء الله.

## الـ Decorators الخاصة بالعوامل (Properties)

لكتابة Decorator خاص بالـ Parameters نقوم بكتابة تابع (Function) يستقبل ٣ عوامل (Parameters) وهي:

- Target: وتكون قيمتها هي الـ Prototype الخاص بالـ class الذي توجد فيه الـ Parameter أو إلى الـ class نفسه في حال كان هذا العامل (Parameter) خاص بـ static method.
- Property key: اسم الوظيفة (Method) التي تستقبل هذا العامل (Parameter)
- Index: الرقم التسلسلي لهذا العامل (Parameter) بين مجموعة العوامل كلها التي تستقبلها الوظيفة Method.

مرةً أخرى لا يمكننا القيام بالكثير من الأشياء في Decorators العوامل (Parameters) بدون استخدام Reflect. لكن بما أن هذا ليس موضوع المقالة سنكتفي ببرمجة Decorator يقوم بطباعة اسم الصف (Class) والوظيفة (Method) و الرقم التسلسلي (Index) لعامل (Parameters).

```ts
function log(target: any, propertyKey: string, index: number) {
  console.log(
    `Class: ${target.constructor.name}, Method: ${propertyKey}, Index: ${index}`
  );
}

class Point {
  add(@log x: number, @log y: number) {
    // ...
  }
}

const point = new Point();
point.add(4, 5);
```

وعند تشغيل هذا البرنامج سيكون الخرج:

```
Class: Point, Method: add, Index: 1
Class: Point, Method: add, Index: 0
```

> لاحظ: يتم تنفيذ الـ Decorators من آخر عامل (Parameter) إلى أول واحد.>

> ينطبق الأمر عند تطبيق أكثر من Decorator واحد على Method أو Property حيث يتم تنفيذ هذه الـ Decorators بدءاً من الأقرب للـ Method أو الـ Property

## الملخص

تعتمد الـ Decorators في Typescript على النمط التصميمي (Design Pattern) المدعو Decorator (ومن هنا الاسم).

وهي عبارة عن ميزة في اللغة تتيح لنا مشاركة الأكواد التي تقوم بالتعديل على سلون صف (Class) أو وظيفة (Method) أو ما ذكر أعلاه دون التغيير على واجهته التخاطبية (Interface).

## المراجع

- [Typescript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
