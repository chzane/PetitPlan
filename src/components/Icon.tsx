import { ReactComponent as MapPin } from '../assets/icon/map-pin.svg';
import { ReactComponent as CalendarTime } from '../assets/icon/calendar-time.svg';
import { ReactComponent as Link } from '../assets/icon/map-pin.svg';
import { ReactComponent as Box } from '../assets/icon/box.svg';
import { ReactComponent as PlayerPlay} from '../assets/icon/player-play.svg';
import { ReactComponent as Flag } from '../assets/icon/flag.svg';

const IconList: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'map-pin': MapPin,
    'calendar-time': CalendarTime,
    'link': Link,
    'box': Box,
    'player-play': PlayerPlay,
    'flag': Flag
};

interface IconProps {
    name: string;   // 图标名称
    w?: string;   // 图标宽度
    h?: string;   // 图标高度
    className?: string;   // class
    [key: string]: any;   // 其他属性
}

// 图标组件
function Icon({ name, w = '18px', h = '18px', className = '', ...props }: IconProps) {
    const SvgIcon = IconList[name];

    if (!SvgIcon) {
        console.warn(`Icon "${name}" not found in IconList.`);
        return null;
    }

    return <SvgIcon className={className} style={{ width: w, height: h }} {...props} />;
}

export default Icon;
