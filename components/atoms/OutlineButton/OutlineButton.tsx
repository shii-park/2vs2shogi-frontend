import './OutlineButton.css';

type Props = {
    label: string;
    onClick: () => void;
};

export function OutlineButtton ({label, onClick}: Props) {
    return <button className="outlinebutton" onClick={onClick}>{label}</button>
}
