import './OutlineButton.css';

type Props = {
    label: string;
    onClick: () => void;
};

export function OutlineButtton ({label, onClick}: Props) {
    // 1文字（?など）の場合は丸くするクラスを追加
    const isCircle = label.length === 1;
    return (
        <button 
            className={`outlinebutton ${isCircle ? 'circle' : ''}`} 
            onClick={onClick}
        >
            {label}
        </button>
    );
}
