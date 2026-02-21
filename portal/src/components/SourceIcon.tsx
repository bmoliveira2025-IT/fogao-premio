import Image from 'next/image';

const SOURCE_ICONS: Record<string, string> = {
    'CNN': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAgVBMVEXMAADLAADTMzPZPDzVLS3TIiLUJyfOCQnQGxvqnZ3++fn////wvb3gdnb77u70xsbnjo7mk5P10dH22dnebW3rs7PvtLTfY2P65ubOEhLtra3dXFzaVFTvuLjyzc354eHlgYHrp6fro6Pqnp7khYXaRkb55OTSPT3TSUnfZWXfa2snkjuZAAABH0lEQVR4Ac2RBYLDIBAAd+OyAWKUEG9DuPT//zuLnLyggzM48Kog4mfaa0fzxziuh77z1RMECKEXBOHhojhJU8pYyhFEmubgFUTOvk7ASyHyqpY3lTW6blXn877fJcRDPA48r3UxMXfmdzk0p8SAZiUQsdaKZK9pfIzLJQ3p0UOAWq/ppNa+ZFNSykNarpWzz5xVnPY0SMkOCdDrsmy+ZjJb6IGoS6r1lHgbBU8/uTPjslzS28a267Q4rTL+RCsHYq7JYqGp92EHjR6+mEJ05FABOpw/f71fCBACQoMQHV1wSbNk2ySs0dFzssIe0w7Z8XkiMvNyq2RXd9Mf2T6Wh3h0xUJb/KROGvhFaLwwavwQfd82QWjsv88+yj0gvCQf7mYXpe8g9xYAAAAASUVORK5CYII=',
    'LANCE': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAABBUlEQVR4Ac3VIQiDQBTG8bWB8dqGUXu0Fy3LFutWluyG9WiH9Wur671eby7bwd3BC/Kx88n2IQt/GOzwJw/vble1p02jPCQ5H8ym4O6Z977J5+R3gy/BBq2A2Cj/NWxwAAizH0FjTO17QKUOIoBlRQy8+SaoXsayVAFHWcsC80oBezbY6ePkglYfJxd0+jiJoDLOlAoml+N+ARxkHQ9UvtCODsoe7H1OHycBxDxSeKydH2V8UI8Hwh50ssn5oGCjQFhFA/HCjfUreA+3dyjsu3X3X1Z8C2I1G7wqYCmgpYw0jE0FZZ12wuigFB7qe8VGCqeMA6xduS3ih/O82Bo8xnSQ0N+Cb7lRji6nlu/zAAAAAElFTkSuQmCC',
    'BOTAFOGO': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAMAAAA2a+hwAAAAUVBMVEVHcEwJCgkAAQAAAAAAAAABAAAAAABjYWDMy8vt7e35+fm+vLwOCwoICgkCAgJ1dHTb2tr///8LDAuysLA1MzOmpKUVEhJMS0qPjY0kIyIFBwY+DaoQAAAAG3RSTlMAOYzW8f/A////////GK7///9d/////////3WipY62AAABgElEQVR4AW2PAY6sIBBEQSkRbYVWxHHuf9BfDK75s9mXhGA/LArzYLveAa7vrPmNHZwfwzSF2ctgl//MYlcXk6qGwCVFt97ablvXI3K6Z5C880xE322bNSuyP6jmDClEkGfqw59YzXooOUBVTVva7CN3D5SKnF5KBfDzLTNKA/v8bPMtT/mZhPAj5ZF4Bprl3p+39ChCCl6qL0jb+498aYT4q1wFSTVlcp6CqC9KrmDIF7mmxM50XncUlKQPKYPF9XybDZpYqB69YRA/R8VmrAuKQuCb8+1rCs6aZZhbf8QmI9pL5mExpot6oMqxyXbJUfsYY/HJlaIaSgmql9TUCZZy6XkKtdAMEewsVK/Y+8WQ96UBTOWQ4MVchuV3dfz1c/qqjqCm3D+SDVO96AFZJ2zN8TWRwY8Thka+48ayU4L8uKSHs+Zhw9hsc6OroQ9vGTUIo3EFHcGmXxaHsjN7MvPbkc151ZRU/Xdmww4yq87XYM0fLJ3z3nXPG37r9Vv9AxcMKNdX8gpBAAAAAElFTkSuQmCC',
    'TERRA': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAIAAAD9b0jDAAAB4ElEQVR4Ae3VA4ydQRQF4FvbtqMqrt2gDmq3Qe02qG3btm27Xdu2bdw9T7P8sebkZuJvzpi4EFqZQCvQ5HC2sY1+9jngyCOv1dfdZlxwHX/eaualSXxnFb87wV5fvdSi8Rxil3zhY9KwW9G0yVpf220M5UTbj53eRrypDV+llz9arVNGzZN3P0qkp4n0PLGJgFBCR2ncIb47u/GV9sZfaL7djsdyqHvKc4gvEtug7ke1ENxJp/6/g656RJtgElgTZg4351fEf7qaePcgj9okh/5OWoyAGVGIWFDOqX3sx9/a2enQ2H+/JVGso0BRuqQs0RyvpqNh50+rRU96ETZdCg2106Oe3RoGrF4iiX5PmpERxe7jAEmhiVH8i17qUN+pEyRRbD32XaAYAGFlUEtapUN9xgyT232BirB+MY45ohFWEVhNiApJcX8eZUYxxpeoVTmiSKcTQQfv3S53+MWaisIwGcPG+vl737zj0buLEL1H9lW4UZbJhx5zW1Fvo1r/8G7gZDXc7cQVi3kLv1KTv0SAdJw4TAoo7kzgZYo6Uz1pbzXeQKICphFEYSEd8ubmlXpziJdqrU0og7uUsNFYR0TDCuTp6TN6wFdm8unRmv7BOn5zkW3/MidXfCcVqGJLA/BWEp0DI72jAAAAAElFTkSuQmCC',
    'FOGAONET': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAMFBMVEVHcEwaGhkaGhoaGhkZGRgSEhFqamoAAAC3t7fv7+9QUE////+hoaExMTDm5ua9vb3EyHi/AAAABXRSTlMAAzj/OEGAWJsAAACzSURBVHgBY2BgFIQDAQYGJmMk4MDAjMw1YBBG5hpCuabBKNywVBRuRTsKt3I6Mtd09a5gJK756T3FMK5peXn57J1AIhjMDZs5c+bu3UAiFcw1v7cbDN4WQ/SGnwbx9pTCjKqavXv3zuUQo8AGAyWLEdzXu3fvQ3Bjd+97vfsqnFuz+3v97uNwbt22YvPs5zCu6c3rxsa1c4Nh3OXBQKIKxjUOBvsKqhgOMLloAYsW7GiRAgAjEGyyPBPgqAAAAABJRU5ErkJggg==',
    'ODIA': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAvVBMVEX/yAD/ygD/0QD/0wD/zAD/zwD/zQDPszSEg2xhcnt2e3PErD+fllCPimSNiGiumlTowhn3yQDguCPTsDl4fHK1n1Cyo0cAPaiNjWJvfnEqWpAfVpVofHNhd3cuVpjavAAAOq2Ki2EATZp9gXFBXpH/1gCdk1oMSqB6hGn/2gCRkksASKOzq0GKgXw3W5PzyQCLj09ibYm5szWflVWRjlgAQaUtXopCY4vStwC4pEh6hm1BXZFVbIBEZYXZuinc797sAAAAvklEQVR4Ae2MxWHDQBBF/18Qa8PM18AlzP13kGuYmW2PWAW4Ab9hxIA+sDYSFMBmgBZQISd0txl6rOmICUiQFMueRJT3gjCj/BxizleZJplr8qkY64XkhSik7mv+MRkaiog0vf0J4xidoZ8k4RoUFqMcBm9mCDVLPU/iJVvYJ6AantkhPTS0/H9TwL0tBjZwi/ndRuCmUOMdHO+eDI3QriyEoTsdWTidPDlxW26knWqtbf2liorUxlbRKgzoSwnq2S77/3Nb0gAAAABJRU5ErkJggg==',
    'GLOBO': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAPFBMVEVHcEwGq0kGsEsGrEkGq0gFqkcHrEkKrkoApjk1tGBmw4Xg9Oj////M6taa16/t+fKz4cNIum+M0aNawHsT8aATAAAAB3RSTlMAbb7k9v9JOomd4gAAAOtJREFUeAF9kwUCxCAMBKnkCM2i/f9fL6XGCZ0KMriYjWGcZmqYp3EwOy9r6QdrX7ujv1TbcWq1v74czEhdRjP15WTmvpzNHjI5R+SsxqzGmCq75EUAH+CZQgRk4UYuACKgMqmKwNLICMmuqMzAypwgt8xAZmIPHxBTSh5wl1wRt461zwTs5LbmetYUl7O+TZ+CuOS09xmISoz2lhmVfbQxAolvyS6JhKSSigAS2kVYHSuCwHWtLDfSRqRSZB9jQ114F1Ep/LXwU61avEha+XvL9s3mjd/Nfjwmpi/vo2n/Hc3mUNv2293DdXgDUjYUtfn+5vMAAAAASUVORK5CYII=',
};

const getSourceColor = (source?: string) => {
    const s = source?.toLowerCase() || '';
    if (s.includes('globo')) return 'bg-green-600';
    if (s.includes('botafogo')) return 'bg-black';
    if (s.includes('cnn')) return 'bg-red-600';
    if (s.includes('lance')) return 'bg-green-600';
    if (s.includes('terra')) return 'bg-orange-600';
    if (s.includes('odia') || s.includes('o dia')) return 'bg-blue-600';
    if (s.includes('fogo na rede')) return 'bg-red-700';
    return 'bg-[#333]';
};

interface SourceIconProps {
    source?: string;
    size?: number; // Tailwind class size equivalent or pixel logic if needed, but here using purely for container
    className?: string; // For explicit width/height classes
}

export default function SourceIcon({ source, className = "w-4 h-4" }: SourceIconProps) {
    const s = source?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || '';
    const matchingKey = Object.keys(SOURCE_ICONS).find(k => s.includes(k));
    const iconUrl = matchingKey ? SOURCE_ICONS[matchingKey] : null;

    if (iconUrl) {
        return (
            <div className={`${className} relative flex-shrink-0 rounded overflow-hidden`}>
                <Image
                    src={iconUrl}
                    alt={source || 'Source'}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`${className} rounded flex items-center justify-center text-[6px] font-bold text-white ${getSourceColor(source)}`}>
            {source?.charAt(0) || 'F'}
        </div>
    );
}
