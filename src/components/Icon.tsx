import MapPin from '../assets/icon/map-pin.svg';
import CalendarTime from '../assets/icon/calendar-time.svg';
import Link from '../assets/icon/link.svg';

const IconList: Record<string, string> = {
    'map-pin': MapPin,
    'calendar-time': CalendarTime,
    'link': Link
};

interface IconProps {
    name: string;   // 图标名称
    w?: string;   // 图标宽度
    h?: string;   // 图标高度
    alt?: string;   // 图标描述
    className?: string;   // class
    [key: string]: any;   // 其他属性
}

// 图标组件
function Icon({ name, w = '18px', h = '18px', alt = '', className = '', ...props }: IconProps) {
    const src = IconList[name];

    if (!src) {
        console.warn(`Icon "${name}" not found in IconList.`);
        return null;
    }

    return <img src={src} alt={alt || name} className={`${className}`} style={{ width: w, height: h }} {...props} />;
}

export default Icon;
