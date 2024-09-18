import { twMerge } from 'tailwind-merge';
import { rules } from "@/rule/rules";
import { properties } from "@/rule/properties";
import { pxToRem, convertColorInString } from "@/utils/conversions";

interface cssObject {
  [key: string]: string;
}

export const tailwindConversion = (css: cssObject): { tailwind: string, style: string } => {
  const tailwindClasses = [];
  const seyles = []
  // 遍历 CSS 对象中的每个属性
  for (const [property, val] of Object.entries(css)) {
    let value = val
    if (/['"]/.test(val)) {
      continue
    }
    // 获取映射表中的规则
    const rule = rules[property];

    if (value.includes('px')) {
      value = pxToRem(value)
    }
    value = convertColorInString(value)
    if (rule && rule[value]) {
      // 如果在映射表中找到对应的规则，使用它
      tailwindClasses.push(rule[value]);
    } else {
      // // 如果找不到对应的规则，使用任意值写法
      const { licit, rule } = generateArbitraryClass(property, value);
      if (licit) {
        tailwindClasses.push(rule);
      } else {
        seyles.push(rule)
      }
    }
  }

  const tailwind = twMerge(...tailwindClasses)
  console.log(tailwind)

  return {
    tailwind: tailwind,
    style: seyles.join(';')
  };
};


// 处理找不到的属性，生成任意值写法
const generateArbitraryClass = (property: string, value: string): { licit: boolean, rule: string } => {
  // 尝试从映射表中找到 Tailwind 的简写属性
  const tailwindProperty = properties[property];
  if (!tailwindProperty) {
    //不存在任意值写法
    return {
      licit: false,
      rule: `${property}:${value}`
    };
  }
  const sanitizedValue = value.replace(/\s+/g, '');
  return {
    licit: true,
    rule: `${tailwindProperty}-[${sanitizedValue}]`
  };
};
