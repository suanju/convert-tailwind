import { colors } from '@/rule/color_names';
export const pxToRem = (value: string): string => {
    return value.replace(/(\d*\.?\d+)px/g, (_, p1) => {
        const remValue = (parseFloat(p1) / 16).toFixed(2); // 假设1rem = 16px
        return `${cleanDecimal(remValue)}rem`;
    });
};


export const cleanDecimal = (value: string): string => {
    return value.replace(/\.?0+$/, '');
}

export const processTailwindClasses = (classes: string[]) => {
    // 去重
    const uniqueClasses = Array.from(new Set(classes));
    const processedClasses = new Map();
    uniqueClasses.forEach(cls => {
        const lastDashIndex = cls.lastIndexOf('-');
        const head = lastDashIndex === -1 ? cls : cls.slice(0, lastDashIndex);
        const tail = lastDashIndex === -1 ? '' : cls.slice(lastDashIndex + 1);
        if (tail.startsWith('[') && tail.endsWith(']')) {
            processedClasses.set(head, cls);
        } else {
            processedClasses.set(head, cls);
        }
    });
    return Array.from(processedClasses.values());
}


export const convertColorInString = (str: string): string => {
    // 将颜色值转换为带透明度的 16 进制格式
    function convertColor(color: string): string {
        function rgbToHex(r: number, g: number, b: number): string {
            // 透明度默认为 100%
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}ff`;
        }

        function rgbaToHex(r: number, g: number, b: number, a: number): string {
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
        }

        if (colors[color]) {
            color = colors[color];
        }

        const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        const rgbaMatch = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([01]|0\.\d+)\)$/);
        const hexMatch = color.match(/^#([0-9a-fA-F]{3}){1,2}$/);
        const hexWithAlphaMatch = color.match(/^#([0-9a-fA-F]{8})$/);

        if (rgbMatch) {
            return rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
        } else if (rgbaMatch) {
            return rgbaToHex(parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3]), parseFloat(rgbaMatch[4]));
        } else if (hexMatch) {
            const hex = hexMatch[0];
            return hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}ff` : `${hex}ff`;
        } else if (hexWithAlphaMatch) {
            return `#${hexWithAlphaMatch[1]}`;
        }

        return color;
    }

    // 使用正则表达式匹配颜色
    const colorRegex = /(?:rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(?:[01]|0\.\d+)\)|#[0-9a-fA-F]{3,8})/g;

    // 替换字符串中的颜色
    return str.replace(colorRegex, (match) => convertColor(match));
};

