import './OutlineButton.css';

type Props = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export function OutlineButtton ({label, onClick, disabled = false}: Props) {
    return <button onClick={onClick} disabled={disabled}>{label}</button>
}
